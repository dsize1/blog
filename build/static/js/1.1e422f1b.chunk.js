(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{308:function(t,e){},316:function(t,e,n){"use strict";n.r(e);var a=n(11),o=n(12),i=n(15),r=n(13),l=n(14),s=n(6),c=n(3),f=n(0),h=n.n(f),d=n(285),u=n.n(d),g=n(2),p=n(82),m=function(t){return h.a.createElement("div",null,h.a.createElement("label",null,"\u753b\u7b14\u989c\u8272\uff1a",h.a.createElement("input",{type:"color",value:t.color,onChange:t.onChange})),h.a.createElement(p.a,{text:t.isPickingColor?"\u6b63\u5728\u53d6\u8272":"\u5f00\u59cb\u53d6\u8272",onClick:t.onClick}))},v=function(t){return h.a.createElement("div",{onChange:t.onChange},t.commonColors.map(function(t,e){return h.a.createElement("label",{key:e,style:{backgroundColor:t}},h.a.createElement("input",{type:"radio",name:"color-selector",value:t}))}))},b=n(47),y=n.n(b);function x(){var t=Object(c.a)(["\n  color: ",";\n  & .drawing-board {\n    margin: 0 auto 1rem;\n    display: block;\n    transition: all .5s ease-in-out;\n    box-shadow: 0px 0px 2px rgba(30, 30, 30, 1);\n  }\n\n  & .drawing-board:hover {\n    box-shadow: 0px 0px 10px rgba(30, 30, 30, 0.8);\n    transform: translate(0, -2px) \n  }\n\n  & .magnifying-lens {\n    width: 200px;\n    height: 200px;\n    overflow: hidden;\n    color: transparent;\n    position: relative;\n    border: 5px solid #333;\n    box-shadow: inset 0px 0px 75px rgba(128, 128, 128, 0.8);\n    border-radius: 50%;\n    background-color: rgba(248, 248, 248, 0.8);\n  }\n\n  & .point {\n    width: 1px;\n    height: 1px;\n    position: absolute;\n    left: 100px;\n    top: 100px;\n    background-color: #ff0000;\n    border-radius: 50%;\n  }\n\n  & .magnifying-lens canvas {\n    position: absolute\n  }\n\n  & .tool-bar {\n    display: flex;\n    margin: 1rem auto;\n    max-width: 900px;\n  }\n  & .tool-bar>div:nth-of-type(2) {\n    padding: 1rem;\n    padding-left: 5rem;\n    display: flex;\n    flex-direction: column;\n    justify-content: center;\n  }\n  & .tool-bar>div:nth-of-type(2)>* {\n    margin-top: 1rem;\n  }\n  & .tool-bar>div:nth-of-type(2)>p i {\n    color: red;\n  }\n  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(1) {\n    display: flex;\n  }\n\n  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(1)>* {\n    margin-right: 1rem;\n  }\n  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2) {\n    display: flex;\n  }\n  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2)>label {\n    width: 1.25rem;\n    height: 1.25rem;\n    margin: 0 0.2rem;\n    border: 1px solid;\n  }\n  & .tool-bar>div:nth-of-type(2)>div:nth-of-type(2)>label>input {\n    visibility: hidden;\n    pointer-events: none;\n  }\n  &>span {\n    margin: 1rem;\n    float: right;\n  }\n"]);return x=function(){return t},t}var C=g.b.div(x(),function(t){return t.theme.color}),k=function(t){function e(t){var n;return Object(a.a)(this,e),(n=Object(i.a)(this,Object(r.a)(e).call(this,t))).state={pixelData:[],commonColors:["#000000","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff","#ff5722","#faac8e","#f8cb8c","#e91e63","#d7ff07","#97fddc","#673ab7","#37a93c"],color:"#000000",width:880,height:544,isPickingColor:!1,clientsCount:0,factor:1,offsetX:200,offsetY:200,scale:"scale(1)",origin:"center",lastX:0,lastY:0},n.handelMouseEnter=n.handelMouseEnter.bind(Object(s.a)(Object(s.a)(n))),n.pickColor=n.pickColor.bind(Object(s.a)(Object(s.a)(n))),n.drawDot=n.drawDot.bind(Object(s.a)(Object(s.a)(n))),n.handleColorPickerClick=n.handleColorPickerClick.bind(Object(s.a)(Object(s.a)(n))),n.handleColorPickerChange=n.handleColorPickerChange.bind(Object(s.a)(Object(s.a)(n))),n.handleColorSelectorChange=n.handleColorSelectorChange.bind(Object(s.a)(Object(s.a)(n))),n}return Object(l.a)(e,t),Object(o.a)(e,[{key:"handelMouseEnter",value:function(t){var e=this;t.stopPropagation(),this.setState({offsetX:636+t.target.offsetLeft-t.clientX,offsetY:158+t.target.offsetTop-t.clientY,lastX:t.clientX,lastY:t.clientY});var n=this.handleMagnifyingLensEnlarge.bind(this),a=y()(this.handleMagnifyingLensMove.bind(this),17,{leading:!0});t.target.addEventListener("mousemove",a),t.target.addEventListener("mousewheel",n),t.target.onmouseleave=function(t){t.target.removeEventListener("mousemove",a),t.target.removeEventListener("mousewheel",n),e.setState({offsetX:200,offsetY:200,factor:1,scale:"scale(1)",origin:"center",lastX:0,lastY:0})},t.target.onclick=function(t){t.stopPropagation(),e.setState({factor:1,scale:"scale(1)"}),e.state.isPickingColor?e.pickColor(t):e.drawDot(t)}}},{key:"handleMagnifyingLensMove",value:function(t){this.setState({offsetX:this.state.offsetX+(this.state.lastX-t.clientX)*this.state.factor,offsetY:this.state.offsetY+(this.state.lastY-t.clientY)*this.state.factor,lastX:t.clientX,lastY:t.clientY})}},{key:"handleMagnifyingLensEnlarge",value:function(t){var e;if(t.preventDefault(),t.deltaY>0&&this.state.factor<8)e=2*this.state.factor;else{if(!(t.deltaY<0&&this.state.factor>1))return;e=.5*this.state.factor}var n=636+t.target.offsetLeft-t.clientX,a=158+t.target.offsetTop-t.clientY,o="".concat(100-n,"px ").concat(100-a,"px"),i="scale(".concat(e,")");this.setState({factor:e,offsetX:n,offsetY:a,origin:o,scale:i})}},{key:"handleColorPickerClick",value:function(){this.setState({isPickingColor:!this.state.isPickingColor})}},{key:"handleColorPickerChange",value:function(t){this.setState({color:t.target.value})}},{key:"handleColorSelectorChange",value:function(t){this.setState({color:t.target.value})}},{key:"rgba2Hex",value:function(t){return"#"+(t=(t=Array.from(t)).map(function(t){return t.toString(16).padStart(2,"0")}))[0]+t[1]+t[2]}},{key:"pickColor",value:function(t){var e=t.offsetX,n=t.offsetY,a=this.ctx1.getImageData(e,n,1,1).data;this.setState({color:this.rgba2Hex(a),isPickingColor:!1})}},{key:"drawDot",value:function(t){var e=t.offsetX,n=t.offsetY;this.ws.emit("drawDot",{x:e,y:n,color:this.state.color}),this.ctx1.fillStyle=this.state.color,this.ctx1.fillRect(e,n,1,1),this.ctx2.fillStyle=this.state.color,this.ctx2.fillRect(e,n,1,1)}},{key:"componentDidMount",value:function(){var t=this,e=u()("https://www.chengcici.info");this.ws=e;var n=this.DrawingBoard;n.addEventListener("mouseenter",this.handelMouseEnter);var a=this.MagnifyingLens;n.style.imageRendering="pixelated",a.style.imageRendering="pixelated";var o=n.getContext("2d",{alpha:!1});window.ctx1=o,this.ctx1=o;var i=a.getContext("2d",{alpha:!1});this.ctx2=i,e.on("init",function(e){var n=new Blob([new Uint8Array(e)]),a=URL.createObjectURL(n),o=new Image;o.src=a,o.onload=function(){t.ctx1.drawImage(o,0,0),t.ctx2.drawImage(o,0,0)}}),e.on("onlineCount",function(e){t.setState({clientsCount:e.count})}),e.on("updataDot",function(e){e.forEach(function(e){t.ctx1.fillStyle=e.color,t.ctx1.fillRect(e.x,e.y,1,1),t.ctx2.fillStyle=e.color,t.ctx2.fillRect(e.x,e.y,1,1)})})}},{key:"componentWillUnmount",value:function(){this.DrawingBoard.removeEventListener("mouseenter",this.handelMouseEnter),this.ws.close()}},{key:"render",value:function(){var t=this,e=this.state.width,n=this.state.height,a=this.state.offsetX+"px",o=this.state.offsetY+"px",i=this.state.scale,r=this.state.origin;return h.a.createElement(C,null,h.a.createElement("div",{className:"tool-bar"},h.a.createElement("div",{className:"magnifying-lens"},h.a.createElement("canvas",{ref:function(e){return t.MagnifyingLens=e},width:e,height:n,style:{left:a,top:o,transform:i,transformOrigin:r}}),h.a.createElement("div",{className:"point",style:{transform:"".concat(i," translate(50%, 50%)")}})),h.a.createElement("div",null,h.a.createElement("p",null,h.a.createElement("span",null,"\u5f53\u524d\u653e\u5927\u500d\u6570\uff1aX",h.a.createElement("i",null,this.state.factor),"\uff0c\u9f20\u6807\u6eda\u8f6e\u5411\u4e0a\u7f29\u5c0f\uff0c\u5411\u4e0b\u653e\u5927\u3002")),h.a.createElement(m,{onClick:this.handleColorPickerClick,onChange:this.handleColorPickerChange,color:this.state.color,isPickingColor:this.state.isPickingColor}),h.a.createElement(v,{onChange:this.handleColorSelectorChange,commonColors:this.state.commonColors}))),h.a.createElement("canvas",{className:"drawing-board",ref:function(e){return t.DrawingBoard=e},width:e,height:n}),h.a.createElement("span",null,"\u5728\u7ebf\u4eba\u6570\uff1a",this.state.clientsCount,"\u4eba"))}}]),e}(f.Component);e.default=k}}]);
//# sourceMappingURL=1.1e422f1b.chunk.js.map