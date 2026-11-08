
import PDFDocument from 'pdfkit'
import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'

const COLORS = {
  passed: '#16a34a',
  failed: '#dc2626',
  skipped: '#ca8a04',
  pending: '#6b7280',
  text: '#111827',
  muted: '#6b7280',
  border: '#e5e7eb',
  header: '#f3f4f6',
  errorBg: '#fef2f2',
}

const stripAnsi = (s = '') => String(s).replace(/\u001b\[[0-9;]*m/g, '')

const fmtMs = (ms = 0) =>
  ms >= 1000
    ? `${(ms / 1000).toFixed(2)}s`
    : `${Math.round(ms)}ms`

/* PDF Layout */

function createLayout(doc) {
  const left = doc.page.margins.left

  const width = () =>
    doc.page.width -
    doc.page.margins.left -
    doc.page.margins.right

  const bottom = () =>
    doc.page.height - doc.page.margins.bottom - 15

  const ensure = (height = 0) => {
    if (doc.y + height > bottom()) {
      doc.addPage()
    }
  }

  const reset = y => {
    doc.x = left
    doc.y = y
  }

  return { left, width, bottom, ensure, reset }
}

/* Header Component */

function drawHeader(doc, options, startedAt) {
  doc
    .font('Helvetica-Bold')
    .fontSize(22)
    .fillColor(COLORS.text)
    .text(options.title)

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.muted)
    .text(
      `Generated ${new Date().toLocaleString()} · Duration ${fmtMs(Date.now() - startedAt)}`,
    )

  doc.moveDown(0.8)
}

/* Summary Component */

function drawSummary(doc, totals, unhandledErrors, reason, layout) {
  const { left, width, reset } = layout

  const passed =
    reason === 'passed' &&
    totals.failed === 0 &&
    unhandledErrors.length === 0

  const cards = [
    ['Status', passed ? 'PASSED' : 'FAILED', passed ? COLORS.passed : COLORS.failed],
    ['Total', totals.total, COLORS.text],
    ['Passed', totals.passed, COLORS.passed],
    ['Failed', totals.failed, COLORS.failed],
    ['Skipped', totals.skipped + totals.pending, COLORS.skipped],
  ]

  const gap = 8
  const cardWidth = (width() - gap * 4) / 5
  const y = doc.y

  cards.forEach(([label, value, color], i) => {
    const x = left + i * (cardWidth + gap)

    doc
      .roundedRect(x, y, cardWidth, 52, 6)
      .lineWidth(1)
      .strokeColor(COLORS.border)
      .stroke()

    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(label.toUpperCase(), x + 8, y + 10, {
        width: cardWidth - 16,
      })

    doc
      .font('Helvetica-Bold')
      .fontSize(15)
      .fillColor(color)
      .text(String(value), x + 8, y + 25, {
        width: cardWidth - 16,
      })
  })

  reset(y + 70)
}

/* Module Component */

function drawModule(doc, mod, layout) {
  const { left, width, ensure, reset } = layout

  ensure(35)

  const y = doc.y

  doc
    .rect(left, y, width(), 22)
    .fill(COLORS.header)

  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(mod.failed ? COLORS.failed : COLORS.text)
    .text(mod.file, left + 8, y + 6, {
      width: width() - 115,
      lineBreak: false,
      ellipsis: true,
    })

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(
      `${mod.tests.length} tests · ${fmtMs(mod.duration)}`,
      left,
      y + 7,
      {
        width: width() - 8,
        align: 'right',
      },
    )

  reset(y + 29)
}

/* Error Component */

function drawError(doc, error, options, layout) {
  const { left, width, bottom, ensure, reset } = layout

  const lines = stripAnsi(error).split('\n')

  const body =
    lines.slice(0, options.maxErrorLines).join('\n') +
    (lines.length > options.maxErrorLines ? '\n…' : '')

  doc.font('Courier').fontSize(7.5)

  const maxHeight = bottom() - doc.page.margins.top - 20

  let remaining = body

  while (remaining.length) {
    const available = bottom() - doc.y

    if (available < 35) {
      doc.addPage()
      continue
    }

    let end = remaining.length

    while (end > 1) {
      const chunk = remaining.slice(0, end)

      const height = doc.heightOfString(chunk, {
        width: width() - 28,
      }) + 10

      if (height <= Math.min(available, maxHeight)) break

      end = Math.max(1, Math.floor(end * 0.8))
    }

    const chunk = remaining.slice(0, end)
    remaining = remaining.slice(end)

    const height = Math.min(
      doc.heightOfString(chunk, {
        width: width() - 28,
      }) + 10,
      maxHeight,
    )

    ensure(height)

    const y = doc.y

    doc
      .rect(left + 14, y, width() - 14, height)
      .fill(COLORS.errorBg)

    doc
      .font('Courier')
      .fontSize(7.5)
      .fillColor(COLORS.failed)
      .text(chunk, left + 20, y + 5, {
        width: width() - 28,
        height: height - 10,
      })

    reset(y + height + 6)
  }
}

/* Test Component */

function drawTest(doc, test, options, layout) {
  if (!options.showPassed && test.state === 'passed') return

  const { left, width, ensure, reset } = layout

  doc.font('Helvetica').fontSize(9)

  const nameHeight = doc.heightOfString(test.name, {
    width: width() - 120,
  })

  ensure(Math.max(nameHeight, 12) + 6)

  const y = doc.y

  doc
    .circle(left + 8, y + 5, 3)
    .fill(COLORS[test.state] ?? COLORS.pending)

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(COLORS.text)
    .text(test.name, left + 20, y, {
      width: width() - 120,
    })

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(COLORS.muted)
    .text(
      `${test.state} · ${fmtMs(test.duration)}`,
      left,
      y + 1,
      {
        width: width(),
        align: 'right',
      },
    )

  reset(y + Math.max(nameHeight, 12) + 5)

  if (test.state === 'failed') {
    for (const error of test.errors) {
      drawError(doc, error, options, layout)
    }
  }
}

/* Unhandled Errors Component */

function drawUnhandledErrors(doc, errors, options, layout) {
  if (!errors.length) return

  layout.ensure(35)

  doc
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor(COLORS.failed)
    .text('Unhandled errors')

  doc.moveDown(0.5)

  for (const error of errors) {
    drawError(
      doc,
      error?.stack || error?.message || String(error),
      options,
      layout,
    )
  }
}

/* Footer Component */

// function drawFooter(doc, layout) {
//   const { left, width } = layout
//   const { count } = doc.bufferedPageRange()

//   for (let i = 0; i < count; i++) {
//     doc.switchToPage(i)

//     const previousBottom = doc.page.margins.bottom
//     doc.page.margins.bottom = 0

//     doc
//       .font('Helvetica')
//       .fontSize(8)
//       .fillColor(COLORS.muted)
//       .text(
//         `Page ${i + 1} / ${count}`,
//         left,
//         doc.page.height - 28,
//         {
//           width: width(),
//           align: 'center',
//         },
//       )

//     doc.page.margins.bottom = previousBottom
//   }
// }


// function drawFooter(doc, layout) {
//   const { left, width } = layout
//   const { count } = doc.bufferedPageRange()

//   for (let i = 0; i < count; i++) {
//     doc.switchToPage(i)

//     const previousBottom = doc.page.margins.bottom
//     doc.page.margins.bottom = 0

//     const centerX = left + width() / 2
//     const pageY = doc.page.height - 35
//     const poweredY = doc.page.height - 22

//     doc
//       .font('Helvetica')
//       .fontSize(8)
//       .fillColor(COLORS.muted)
//       .text(`Page ${i + 1} / ${count}`, left, pageY, {
//         width: width(),
//         align: 'center',
//         lineBreak: false
//       })

//     const prefix = 'Powered by '
//     const packageName = '@zikojs/vitest-pdf-reporter'

//     const prefixWidth = doc.widthOfString(prefix)
//     const packageWidth = doc.widthOfString(packageName)
//     const totalWidth = prefixWidth + packageWidth
//     const startX = centerX - totalWidth / 2

//     doc
//       .font('Helvetica')
//       .fontSize(8)
//       .fillColor(COLORS.muted)
//       .text(prefix, startX, poweredY, {
//         lineBreak: false
//       })

//     doc
//       .fillColor('#2563eb')
//       .text(packageName, startX + prefixWidth, poweredY, {
//         link: 'https://www.npmjs.com/package/@zikojs/vitest-pdf-reporter',
//         underline: true,
//         lineBreak: false
//       })

//     doc.page.margins.bottom = previousBottom
//   }
// }


function drawFooter(doc, layout) {
  const { left, width } = layout
  const { count } = doc.bufferedPageRange()

  for (let i = 0; i < count; i++) {
    doc.switchToPage(i)

    const previousBottom = doc.page.margins.bottom
    doc.page.margins.bottom = 0

    const y = doc.page.height - 25

    // Page number — left
    doc
      .font('Helvetica')
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(`Page ${i + 1} / ${count}`, left, y, {
        lineBreak: false
      })

    // Powered by — right
    const packageName = '@zikojs/vitest-pdf-reporter'
    const prefix = 'Powered by '

    doc
      .font('Helvetica')
      .fontSize(8)

    const totalWidth = doc.widthOfString(prefix) + doc.widthOfString(packageName)

    const startX = left + width() - totalWidth

    doc
      .fillColor(COLORS.muted)
      .text(prefix, startX, y, {
        lineBreak: false
      })

    doc
      .fillColor('#2563eb')
      .text(packageName, startX + doc.widthOfString(prefix), y, {
        link: 'https://www.npmjs.com/package/@zikojs/vitest-pdf-reporter',
        underline: true,
        lineBreak: false
      })

    doc.page.margins.bottom = previousBottom
  }
}



/* PDF Reporter */

export default class PdfReporter {
  constructor(options = {}) {
    this.options = {
      outputFile: 'test-report.pdf',
      title: 'Test Report',
      showPassed: true,
      maxErrorLines: 25,
      ...options,
    }
  }

  onInit(vitest) {
    this.vitest = vitest
    this.startedAt = Date.now()
  }

  async onTestRunEnd(
    testModules,
    unhandledErrors = [],
    reason = 'passed',
  ) {
    const root = this.vitest?.config?.root ?? process.cwd()
    const data = this.collect(testModules, root)
    const outPath = resolve(root, this.options.outputFile)

    mkdirSync(dirname(outPath), { recursive: true })

    await this.render(data, unhandledErrors, reason, outPath)

    this.vitest?.logger?.log?.(
      `\nPDF report written to ${relative(root, outPath)}\n`,
    )
  }

  collect(testModules, root) {
    const totals = {
      passed: 0,
      failed: 0,
      skipped: 0,
      pending: 0,
      total: 0,
      duration: 0,
    }

    const modules = []

    for (const mod of testModules) {
      const tests = []

      for (const test of mod.children.allTests()) {
        const result = test.result()
        const state = result?.state ?? 'pending'
        const duration = test.diagnostic()?.duration ?? 0

        const errors = (result?.errors ?? []).map(e =>
          stripAnsi(e.stack || e.message || String(e)),
        )

        tests.push({
          name: test.fullName,
          state,
          duration,
          errors,
        })

        totals[state] = (totals[state] ?? 0) + 1
        totals.total++
        totals.duration += duration
      }

      modules.push({
        file: relative(root, mod.moduleId),
        tests,
        failed: tests.filter(t => t.state === 'failed').length,
        duration: tests.reduce((sum, t) => sum + t.duration, 0),
      })
    }

    return { totals, modules }
  }

  render({ totals, modules }, unhandledErrors, reason, outPath) {
    return new Promise((resolvePromise, rejectPromise) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
        autoFirstPage: true,
      })

      const stream = createWriteStream(outPath)

      stream.on('finish', resolvePromise)
      stream.on('error', rejectPromise)
      doc.on('error', rejectPromise)

      doc.pipe(stream)

      const layout = createLayout(doc)

      // Header
      drawHeader(doc, this.options, this.startedAt)

      // Summary
      drawSummary(doc, totals, unhandledErrors, reason, layout)

      // Modules and tests
      for (const mod of modules) {
        drawModule(doc, mod, layout)

        for (const test of mod.tests) {
          drawTest(doc, test, this.options, layout)
        }

        doc.moveDown(0.8)
      }

      // Unhandled errors
      drawUnhandledErrors(doc, unhandledErrors, this.options, layout)

      // Footer
      drawFooter(doc, layout)

      doc.end()
    })
  }
}



export {
  PdfReporter,
  createLayout,
  drawHeader,
  drawSummary,
  drawModule,
  drawTest,
  drawError,
  drawUnhandledErrors,
  drawFooter,
}
