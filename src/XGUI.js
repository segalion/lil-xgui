import {GUI, Controller} from "lil-gui";

function _loadIconify() {  
  if (!document.querySelector(`script[src*=iconify]`)) {
    const script = document.createElement("script");
    script.src = "https://code.iconify.design/2/2.1.2/iconify.min.js";
    script.defer = true;
    document.head.appendChild(script);
    }
}

function _createMulti(element) {
  const multi = document.createElement("div");
  element.parentElement.replaceChild(multi, element);
  multi.style.display = "flex";
  multi.style.gap = "var(	--padding, 2px)";
  multi.appendChild(element);
  return multi
}

Controller.prototype.icon = function (iconName, size, color) {
  const i = this.parent._createIcon(iconName, size, color);
  if (i) this.$name.prepend(i);
  return this;
};

Controller.prototype.name = function (name) {
  this._name = name;
  (this.$name.lastChild?this.$name.lastChild:this.$name).textContent = name
  return this;
};

Controller.prototype.append = function (object, property, ...opts) {
  if (!this.$multi) this.$multi=_createMulti(this.domElement) 
  const controller = this.parent.add(object, property, ...opts);
  controller._beside = this;
  this.$multi.appendChild(controller.domElement);
  return controller;
}

Controller.prototype._show = function (show) {
  show = (show==null) ? !this._hidden : show ; 
  this.domElement.style.display = show?"flex":"none";
}

Controller.prototype._grow = function (icon) {
    const wrapper = document.createElement("div");
    wrapper.classList.add( 'grow-wrapper' );
    const ic = document.createElement("div");
    ic.classList.add( 'grow-icon' );
    ic.appendChild(this.parent._createIcon(icon));
    wrapper.append(ic, this.$widget.lastChild);
    this.$widget.parentElement.replaceChild(wrapper, this.$widget);
  }

export default class XGUI extends GUI {
  constructor(options = {}) {
    options.closeFolders = (options.mode === "accordion")?true:options.closeFolders;
    options.autoPlace = (options.mode === "contextmenu")?false:options.autoPlace;
 
    super({ ...options });

    this.$multi = _createMulti(this.$title);
    this.$multi.classList.add( 'title' );
    this.$title.classList.add( 'remove-bar');
    // this.$title=this.$multi;
    if (options.icon) this.icon(options.icon);
    if (this === this.root) { //ony for root gui
      this.mode = options.mode || "";
      if (options.extensions && options.extensions.includes("filter")) this.controlFilter = this._addControlFilter();
      if (this.mode === "contextmenu") {
          this._installContextMenu();
      } 
    } else { // not root gui
      if (this.root.mode=="accordion") {
        this.$title.addEventListener("click", () => { this._hideSibling(); } );
      }
    }
  }

  _hideSibling(f=this){
    f.parent.children.forEach((sibling) => {
      if ((sibling !== f) && (!sibling._beside)) f._closed ? sibling.show() : sibling.hide();
    });
  }

  _createIcon(iconName, size, color) {
    if (this.root.iconSet==null) {
      _loadIconify();
      const i = iconName.lastIndexOf(":");
      const ic = i>0?iconName.substring(0,i+1):"mdi:";
      this.root.iconSet = (ic.indexOf(":") < ic.length-1)? ic.slice(0,-1): ic;
      if (i>0) iconName = iconName.substring(i+1);
      const cs = getComputedStyle(this.root.domElement);
      this.root.iconSize = cs.getPropertyValue("--icon-size") 
          || (parseInt(cs.getPropertyValue("--font-size")) + 5) + "px";
      this.root.iconColor = cs.getPropertyValue("--icon-color") 
          || cs.getPropertyValue("--text-color") || "#323275";
    }
    if (iconName) {
      const icon = document.createElement("span");
      icon.classList.add("iconify");
      icon.setAttribute("data-icon",
          iconName.includes(":")?iconName:`${this.root.iconSet}${iconName}`);
      icon.style.fontSize = size || this.root.iconSize;
      icon.style.color = color || this.root.iconColor;
      icon.style.marginRight="var( --padding, 2px)";
      return icon;
    }
  }
  	/**
	 * Prepend an iconify icon with "iconset:name" format. Can be used in gui definition.
   * First call load iconify script and define default iconset ("mdi" if missed).
	 * @param {iconName} Can be "name" or "iconset:name" (or "iconset:" to define default iconset).
   * @param {size} Optional, default to css --icon-size var or --font-size+5px
   * @param {color} Optional, only for one-color icons (dont apply to emojis). default to --icon-color||--textcolor||"#323275"
	 * @returns {this}
	 * @example
	 * gui.icon( "home" ); // append mdi:home icon to tittle
	 * const gui = new XGUI(title:"Account",icon: "ic:baseline-:account-circle"); 
   * // Create menu with icon "ic:baseline-account-circle" and default iconset to "ic:baseline-"
	 */
  icon(iconName, size, color) {
    const i = this._createIcon(iconName, size, color);
    if (i) this.$title.prepend(i);
    return this;
  }

	/**
	 * Recursively opens or close a GUI or folder .
	 * @param {boolean} open Pass false to close, empty to toggle.
	 * @returns {this}
	 * @example
	 * gui.openCloseAll( true ); // open all
	 * gui.openCloseAll( false ); // close all
	 * gui.openCloseAll( ); // toggle (open all/ close all)  depending on "this" folder state.
	 */
  openCloseAll(open = this._closed){
    this.foldersRecursive().forEach( f => { f.open(open); });
    return this.open(open);
  }

  _open(open) {
    open = (open==null) ? !this._closed : open ;
      this.$multi.setAttribute( 'aria-expanded', open );
		  this.domElement.classList.toggle( 'closed', !open );
  }
  _show(show) {
    if (show==null) {
      this.$multi.style.display = "flex";
      this.show(!this._hidden);
    }
    else this.domElement.style.display = show?"":"none";
  }

  _addControlFilter() {
    this.filter = ""; //function() { console.log("execute filter function")};
    const controller = this.append(this,"filter","search","mdi:search","hidden").name("")
        .onChange( () => { this._applyFilter(); });
    this.$children.addEventListener("click", (e) => {
      if (this.root.filter==="") return;
      const target = e.target.closest(".lil-gui");
      this.foldersRecursive().forEach( f => { 
        if (f.domElement===target) {
          controller.setValue(""); // this.root.filter=""; and this.root._applyFilter("");
          while (f.parent) {
            f.open(); f.show();
            if (this.root.mode=="accordion") this._hideSibling(f);
            f = f.parent;
          }
        }
      });
    });
    return controller;
  }

  _applyFilter() {
    const query = this.filter.toLowerCase();
    this.controllersRecursive().forEach(c => {
      const nameMatch = String(c._name).toLowerCase().includes(query) || 
          String(c.getValue()).toLowerCase().includes(query);
      c._show(query!=""?(nameMatch):null);
    });
    this.foldersRecursive().forEach(f => {
      f._show(query!=""?true:null);
      f._open(query!=""?true:null);
      const titleMatch = f.$title.textContent.toLowerCase().includes(query);
      f.$multi.style.display = titleMatch?"flex":"none";
    });
  }

  add(object, property, ...opts) {
    let type, params;
    if (typeof opts[0]==='string') {
      type = opts.shift();
      if (Object( opts[0] ) === opts[0]) params = opts.shift();
      }
    const controller = super.add(object, property, ...opts);
    if (typeof type==="string") {
      controller.$widget.lastChild.setAttribute( 'type', type );
      if (Object( params ) === params) {
        Object.entries(params).forEach(([k, v]) => {
          controller.$widget.lastChild.setAttribute( k, v );  
        }); 
      }
      if (typeof opts[0]==='string') { //set icon
        if (opts[1]==="hidden") controller._grow(opts[0]);
        else controller.icon(opts[0]);
      }
    }
    if (object===this.folders && property==="length" ) this.countFolder = controller;
   
    if (this.root.mode === "contextmenu" && controller.$name) controller.$name.classList.add( 'contexmenu' );
    return controller;
  }
  
  append(object, property, ...options) {
    var controller = this.add(object, property, ...options);
    this.$multi.appendChild(controller.domElement);
    controller._beside = this;
    return controller;
  }

  addFolder(name, options={}) {
    const folder = new XGUI({ parent: this, title: name, ...options});
    if (this.root._closeFolders) folder.close();
    if (this.countFolder) this.countFolder.updateDisplay();
    return folder;
  }

  place(x, y) {
    const menu = this.root.domElement;
    document.body.appendChild(menu);
    menu.style.display = "block";
    const menuRect = menu.getBoundingClientRect();
    // Adjust position to not exceed screen
    menu.style.left = `${Math.min(x, window.innerWidth - menuRect.width - 5)}px`;
    menu.style.top = `${Math.min(y, window.innerHeight - menuRect.height - 5)}px`;
    menu.style.position = "absolute";
    menu.style.zIndex = "9999";
  }

  _installContextMenu() {
    this.$multi.style.display = "none"; // oculta el root
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (!e.target.closest(".lil-gui")) {
          this.place(e.clientX, e.clientY);
        }
    });
    this.root._hideContextMenu = (e) => {
      if (!this.root.domElement.contains(e.target)) this.root.hide();
    };
    window.addEventListener("click", this.root._hideContextMenu);
  }
}
