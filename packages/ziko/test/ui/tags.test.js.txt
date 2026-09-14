import { tags, UIElement } from 'ziko/dom'
import { useState } from 'ziko/hooks'
import { expect, test} from 'vitest'

test('test tags', ()=>{
    const para1 = tags.p('Hello world!')
    expect(para1).toBeInstanceOf(UIElement)
    expect(para1.element).toBeInstanceOf(HTMLParagraphElement)
    expect(para1.element.textContent).toBe('Hello world!')

    const para2 = tags.p({ id : 'p-1'}, 'Hello world!')
    expect(para2).toBeInstanceOf(UIElement)
    expect(para2.element).toBeInstanceOf(HTMLParagraphElement)
    expect(para2.element.textContent).toBe('Hello world!')

})