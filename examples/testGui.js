//import {GUI} from "lil-gui";
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm';
import XGUI from "../src/XGUI";

import styles from "../src/styles.css?inline";

function injectStyles() {
    if (document.querySelector("#xgui-styles")) return;
    const style = document.createElement("style");
    style.id = "xgui-styles";
    style.innerHTML = styles;
    document.head.appendChild(style);
}

injectStyles();

// Agregar controles estándar con y sin íconos
const sets = { text: "prueba", filter: "", img:"./assets/frontVerdes.jpeg", speed: 8, enable: true, x: 2, y: 4, player1: true, player2: true, player3: false, player4: false};
let gui,lilgui;

export function testOriginal(){

    // Ejemplo de secondGUI:
    lilgui = new GUI({title: "Original lil-gui menu...", touchStyles: false, closeFolders: true });
    const f1 = lilgui.addFolder("folder 1 ...");
    const f2 = lilgui.addFolder("folder 2 ...");

    f1.add({ flip: () => alert("button1") }, "flip").name("button1");

    f1.add(sets, "speed", 2, 50, 2).name("number:");
    f2.add({ delete: () => alert("Eliminar") }, "delete").name("Eliminar [Supr]");
    f2.add({ edit: () => alert("Editar") }, "edit").name("Edit");
    lilgui.close();
}

export function testXGui() {
    // Ejemplo de focusMode: container: lilgui.domElement,
    gui = new XGUI({ container: lilgui.domElement, title: "Xtended XGui menu...", touchStyles: false, 
        mode: "accordion", icon: "cog", extensions: "filter" });

    const inputs = gui.addFolder("DOM standard inputs...").icon("input");
    const types=["date","datetime-local","color","checkbox","number","radio","file","tel","url","week","search","month","email","submit","hidden","button"];
    types.forEach(type => inputs.add(sets,"text",type,type).name(type+":").onChange((v) => console.log(`${type} = ${v}`)));
    const moreinputs = inputs.addFolder("more inputs...");
    moreinputs.add(sets,"text","email").name("email:");
    // moreinputs.add(sets,"text","password").name("pass:");
    moreinputs.add(sets,"img","image").name("image:").icon("image").onChange((v) => alert(`${v}`));
    const slider=moreinputs.add(sets,"speed","range", {min:5, max: 80, step: 5}, "arrow-left-right").name("range").onChange( ()=>{console.log(sets.speed);});
    const number = slider.append(sets,"speed","number").name("").onChange( () => slider.updateDisplay());
    slider.onChange( () => number.updateDisplay());
    //.onChange((v) => alert(`${v}`))
    // gui.filter="";
    gui.options="";
    const opts = gui.append(gui,"options",["_openAll(true)","_showAll(true)","_openAll(false)", "_showAll()","_openAll()", "_showAll(false)","collapseExpand"]).name("").onFinishChange((v)=>guiOpts(gui,opts,v)); //.icon("more-vert");
    // const filter = gui.append(gui, "filter").name(""); // .icon("search").hide();
    function guiOpts(f,c,v) {
        f.options="";
        c.updateDisplay();
        /*if (v==="expand all") {
            filter.show();
            console.log("filter=",filter);
            filter.$widget.firstChild.focus();
        }*/
        if (v==="_openAll(true)") f._openAll(true);
        if (v==="_showAll(true)") f._showAll(true);
        if (v==="_openAll(false)") f._openAll(false);
        if (v==="_showAll(false)") f._showAll(false);
        if (v==="_openAll()") f._openAll();
        if (v==="_showAll()") f._showAll();
        if (v==="collapseExpand") f.openCloseAll();
    }
        

    //gui = new XGUI({ mode: "focu", title: "Tree Example" ,  touchStyles: false });
    const assets = gui.addFolder("Assets..." , {extensions:"couter, filter", draggable: true}).icon("image-edit");
    assets.append(assets.folders,"length","button").name("");
    // const assets_opt = assets.addMulti(); 
    const assets_opt = assets.add({ select: (n=2) => alert("select mode"+ n) },"select").name("").icon("format-list-checks");
    assets_opt.append(sets, "filter").name("").icon("closet");
    assets_opt.append({ select: (n=2) => alert("add new "+ n) },"select").name("").icon("add-circle");
    assets_opt.append({ select: (n=2) => alert("add new "+ n) },"select").name("").icon("collapse-all");
    assets_opt.append({ select: (n=2) => alert("swap mode"+ n) },"select").name("").icon("menu-swap");
    let a,b,c;
    var t;
    const FA = [], FB = [], FC = [];

    for (let i = 0; i <= 59; i++) {
        a = String.fromCharCode(65 + i);
        FA[i] = assets.addFolder("Asset_" + a , {draggable: true}).icon("image-multiple");
        // console.log("folders=",assets.folders.length);
        t= "Botón en >"+ a;
        const m = FA[i].add({ clone: (n=1) => alert("clone "+ n) }, "clone").name("Clone").icon("content-copy");
        //const m = FA[i].add({ clone: (n=1) => alert("clone "+ n) }, "clone").name("Clone").icon("content-copy");
        m.append({ clone: (n=2) => alert("clone "+ n) }, "clone").name("Supr").icon("image-remove");
        m.append({ clone: (n=3) => alert("clone "+ n) }, "clone").name("Publish").icon("public");
        // m.append({ clone: (n=4) => alert("clone "+ n) }, "clone").name("").icon("keycap-10");
    
        FA[i].add({ action: (p=t) => alert(`Botón en ${p}`) }, "action").name(t).icon("play_arrow");
        FA[i].add(sets,"text","date").name("Fecha").icon("date");
        FA[i].add(sets, "speed", 0, 10, 0.5).name("Velocidad").icon("speedometer");
        FA[i].add(sets, "enable").name("Habilitar");
    }
    //assets_opt.add(sets, "filter").name("").icon("search");

    const classes = gui.addFolder("Classes..." , {draggable: true}).icon("hexagon-slice-1");

    for (let i = 0; i <= 9; i++) {
        a = String.fromCharCode(65 + i);
        FA[i] = classes.addFolder("Class_" + a , {draggable: true}).icon("image-multiple");
        t= "Botón en >"+ a;
        const m = FA[i].add({ clone: (n=1) => alert("clone "+ n) }, "clone").name("").icon("content-copy");
        //const m = FA[i].add({ clone: (n=1) => alert("clone "+ n) }, "clone").name("Clone").icon("content-copy");
        m.append({ clone: (n=2) => alert("clone "+ n) }, "clone").name("").icon("image-remove");
        m.append({ clone: (n=3) => alert("clone "+ n) }, "clone").name("").icon("public");
        const FAA = FA[i].addFolder("Objects...");
        for (let j = 0; j <= 12-i; j++) {
            b = String.fromCharCode(97 + j);
            t= "Botón en >"+ a + ">" + b;
            FB[j] = FAA.addFolder("").title("object [" + b + "]",{draggable: true}).icon("apps");
            FB[j].add({ action: (p=t) => alert(`${p}`) }, "action").name(t).icon("thumb_up_off_alt");
            FB[j].add({ action: (p=t) => alert(`${p}`) }, "action").name(t).icon("twemoji:boy-dark-skin-tone");
            for (let k = 0; k <= 9-j; k++) {
                c= String.fromCharCode(49 + k);
                t= "Botón en >"+ a + ">" + b + ">" + c ;
                FC[k] = FB[j].addFolder("").title("magnets {"+c+"}",{draggable: true}).icon("nature");
                FC[k].add({ action: (p=`${t}`) => alert(`Pusadp Botón ${p}`) }, "action").name(t).icon("folder_shared");
                }
        }
    }
    // gui.foldersRecursive().forEach(folder => folder.close()); // Cerrar todos los folders al inicio

}



export function testContextual(){
    // Crear un menú contextual
    const cmGui = new XGUI({ mode: "contextmenu", icon: "twemoji:", touchStyles: false, width:150 });
    cmGui.add({ flip: () => alert("Toggle/flip") }, "flip").name("Togle/Flip [t]").icon("clockwise-vertical-arrows");
    cmGui.add({ roll: () => alert("Random/Roll") }, "roll").name("Random/Roll [r]").icon("shuffle-tracks-button");
    cmGui.add({ delete: () => alert("Eliminar") }, "delete").name("Eliminar [Supr]").icon("cross-mark");
    cmGui.add({ edit: () => alert("Editar") }, "edit").name("Edit").icon("open-file-folder");


    const f = cmGui.addFolder("Players").title("jugadores").icon("family-man-girl-boy");
    f.add({ delete: () => alert("??") }, "delete").name("Player1").icon("boy-dark-skin-tone","24px");
    const m = f.add({ clone: (n=1) => alert("clone "+ n) }, "clone").name("Clone").icon("keycap-1");
    m.append({ clone: (n=2) => alert("clone "+ n) }, "clone").name("").icon("keycap-2");
    m.append({ clone: (n=3) => alert("clone "+ n) }, "clone").name("").icon("keycap-5");
    m.append({ clone: (n=4) => alert("clone "+ n) }, "clone").name("").icon("keycap-10");    /*const m = cmGui.addMulti();
    m.add(sets, "player1").name("P1").icon("person");
    m.add(sets, "player2").name("P2");
    m.add(sets, "player3").name("P3");
    m.add(sets, "player4").name("P4");*/
    f.add({ delete: () => alert("Eliminar archivo") }, "delete").name("Eliminar", "delete");
    f.add({ delete: () => alert("Eliminar archivo") }, "delete").name("Eliminar", "delete");
}


export function testGui() { 
    testOriginal();
    testXGui();
    testContextual();
}

testGui();
