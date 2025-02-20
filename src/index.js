import styles from "./styles.css?inline";

function injectStyles() {
    if (document.querySelector("#xgui-styles")) return;
    const style = document.createElement("style");
    style.id = "xgui-styles";
    style.innerHTML = styles;
    document.head.appendChild(style);
}

injectStyles();

export { default as XGUI } from './XGUI';
