
__Ziko__.ExtractAll()
pp=Section(
    p("kks jjfjf jdjdj jdjdjd jdjdjd djdjdn kkdk")
).style({
    padding : "2px",
    width : "100px",
    border : "1px red solid"
})

ptr=usePointerEvent(pp, (e)=>e.n = 10)
// ptr.onPtrDown((e)=>console.log(e))

ch = [
    p("ch 1"),
    p("ch 2"),
    p("ch 3"),
    p("ch 4")
]
ch.forEach(n=>n.style({
    border : "1px red solid"
}))
parent = Flex(...ch).style({
    width : "100px",
    height : "200px",
    padding : "10px",
    border : "1px solid darkblue"
}).vertical(0, "space-around")
// pe=expClick(parent).onClick(n=>n.item?.style({background : Random.color()}))
// ppp = link("#",p("jjdjd"))
// a = expClick(ppp)
// a.onClick(e=>console.log({click : e.dx}))
// a.onDblClick(e=>console.log({dblclick : e.dx}))
// function details_setter() {
//   return { el: this.targetElement };
// }
// // pp.onClick(()=>{})
// a=new __ZikoEvent__(pp, ["Click","DblClick"], function(){
//     this.dx=10
//     return {
//         e : this.dx
//     }
// })
// a.onClick(e=>console.log(1))
// a.onClick()

// __Ziko__.__Config__.renderingMode="ssg"
// __Ziko__.__Config__.isSSC = false

// el=document.querySelector("[ziko-ref='p111']")
// // a=new ZikoUIElement(el,"p",{useDefaultStyle:false})
// // a.onClick(()=>console.log("Hiii"))


// Comp=(data = 10)=>{
//     console.log({data})
//     return p("Hello World Hydrated !", data).onClick(e=>console.log("Hydration activated"))
// }

// el.replaceWith(Comp().element)

// // MUI_X_PRODUCTS = [
// //     {
// //       label: 'Data Grid',
// //       children: [
// //         { label: '@mui/x-data-grid' },
// //         { label: '@mui/x-data-grid-pro' },
// //         { label: '@mui/x-data-grid-premium' },
// //       ],
// //     },
// //     {
// //       label: 'Date and Time Pickers',
// //       children: [
// //         { label: '@mui/x-date-pickers' },
// //         { label: '@mui/x-date-pickers-pro' },
// //       ],
// //     },
// //     {
// //       label: 'Charts',
// //       children: [{ label: '@mui/x-charts' }],
// //     },
// //     {
// //       label: 'Tree View',
// //       children: [{ label: '@mui/x-tree-view' }],
// //     },
// //   ];
 
// //   addId=obj=>Object.assign(obj,{id : "hello"})
// // // v=vSlider(
// // //     image("zi.png").size("100%","100%"),
// // //     image("zi.png").size("50%","50%"),
// // //     )
// // //     s=hSlider(
// // //     image("zi.png").size("100%","100%"),
// // //     image("zi.png").size("50%","50%"),
// // //     v,
// // //     hSlider(
// // //     image("zi.png").size("100%","100%"),
// // //     image("zi.png").size("50%","50%"),
// // //     )
// // //     ).size("300px","300px")
// // //ZikoThree.ExtractAll()
// // //a=useFavIcon("https://img.a.transfermarkt.technology/portrait/big/28003-1694590254.jpg?lm=1")
// // //a.onChange(e=>console.log(e))

// // // a=CodeCell("text(1)")
// // // PDFViewer("astro.pdf").size("400px","400px")
// // a=CodeNote().style({
// //     width:"100vw"
// // })
// // data=[
// //     {
// //         "input": "sc=new SceneGl(\"80vw\",\"70vh\")\nsc.add(cube3(3))\nsc.useOrbitControls()",
// //         "output": "<figure style=\"position: relative; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: 80vw; height: 70vh;\"><canvas data-engine=\"three.js r158\" width=\"572\" height=\"516\" style=\"position: relative; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: 572px; height: 516px; touch-action: none;\"></canvas></figure>",
// //         "order": 1,
// //         "type": "js"
// //     }
// // ]
// // data=[
// //     {
// //         "input": "BtnStyle={\n width:\"70%\",\n background:\"darkblue\",\n color:\"white\",\n}\nContainerStyle={\n width:\"200px\",\n height:\"200px\",\n border:\"4px darkblue solid\"\n}\nf=Flex(\n btn(\"Home\"),\n btn(\"About\"),\n btn(\"Education\"),\n btn(\"Portfolio\")\n).vertical(0,\"space-around\").style(ContainerStyle).forEach(n=>n.style(BtnStyle))",
// //         "output": "",
// //         "order": 10,
// //         "type": "js"
// //     },
// //     {
// //         "input": "sc=SceneCss(\"60vw\",\"50vh\")\nsc.add(Main(f))\nsc.background(\"#aaf\")",
// //         "output": "<figure style=\"position: relative; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: 60vw; height: 50vh;\"><canvas data-engine=\"three.js r158\" width=\"572\" height=\"374\" style=\"position: absolute; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: 572px; height: 374px;\"></canvas><div style=\"overflow: hidden; touch-action: none; width: 572px; height: 374px;\"><div style=\"transform-origin: 0px 0px; pointer-events: none; width: 572px; height: 374px;\"><div style=\"transform-style: preserve-3d; width: 572px; height: 374px; transform: perspective(401.023px) scale(1) translateZ(401.023px) matrix3d(0.992693, 0.0336058, -0.11589, 0, 0, -0.960434, -0.278507, 0, 0.120664, -0.276472, 0.953417, 0, 0, 0, -344.406, 1) translate(286px, 187px);\"><main draggable=\"false\" style=\"position: absolute; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: auto; height: auto; pointer-events: auto; user-select: none; transform: translate(-50%, -50%) matrix3d(1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);\"><div style=\"position: relative; box-sizing: border-box; font-family: verdana; margin: 0px; padding: 0px; width: 200px; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: space-around; border: 4px solid darkblue;\"><button style=\"cursor: pointer; width: 70%; background: darkblue; color: white;\">Home</button><button style=\"cursor: pointer; width: 70%; background: darkblue; color: white;\">About</button><button style=\"cursor: pointer; width: 70%; background: darkblue; color: white;\">Education</button><button style=\"cursor: pointer; width: 70%; background: darkblue; color: white;\">Portfolio</button></div></main></div></div></div></figure>",
// //         "order": 21,
// //         "type": "js"
// //     }
// // ]
// // data=[{
// //     "input": "s=Svg()",
// //     "output": "<svg width=\"360\" height=\"300\" style=\"border: 1px solid black;\"></svg>",
// //     "order": 1,
// //     "type": "js"
// // }]
// // // a.import(data)
// // a.addNote()
// // b=csv2arr(`
// // Assa,Coconut,62.6
// // Ksar_es_Seghir,Cherry,76.95
// // Sefrou,Pomegranate,68.67
// // Khenifra,Lime,36.6
// // Assa,Green_Beans,96.03
// // Chefchaouen,Pineapple,89.22
// // Jorf_El_Melha,Salsify,8.67
// // Fes,Fig,4.95
// // Layoune,Kale,84.21
// // Casablanca,Eggplant,48.14
// // Ben_guerir,Plum,30.89
// // Skhirate,Okra,63.18
// // Midelt,Ginger,80.67
// // Sefrou,Pomegranate,96.16
// // Imzouren,Oregano,85.09
// // Temara,Jackfruit,95.57
// // Imzouren,Plantain,97.97
// // Béni_Mellal,Spinach,93.95
// // Sidi_Bouzid,Cherry,53.62
// // Guelta_Zemmur,Peach,57.64
// // `)

// // // ap=Ziko.App()
// // // document.body.addEventListener("hashchange",()=>console.log(1))