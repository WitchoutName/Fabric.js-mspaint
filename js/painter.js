$("#content-wrap").dxScrollView({}).dxScrollView("instance");
$("#test").dxScrollView({}).dxScrollView("instance");
$.fn.addPainterDefaults = {
  idNumberLenght: 8,
  type: "dx-scrollview",
  toolbar: {
    alignment: "horizontal bottom right inside",
    alignmentProcessed: {
      axis: "horizontal",
      posX: "right",
      posY: "bottom",
      posToBorder: "inside",
    },
    offsets: [0, 0],
  },
};

$.fn.addPainterDefaultsOptions = {
  idNumberLenght: "any number greater than 0",
  type: ["dx-scrollview", "div", "img"],
  toolbar: {
    alignment: "any combination of transformProcessed",
    alignmentProcessed: {
      axis: ["horizontal", "vertical"],
      posX: ["left", "right"],
      posY: ["top", "bottom"],
      posToBorder: ["inside", "outside"],
    },
  },
};
$.fn.addPainter = function (options) {
  let lOptions = $.fn.addPainterDefaults;
  for (x in options) {
    if (x in lOptions) {
      if (x != "toolbar") lOptions[x] = options[x];
      else {
        for (y in options[x]) {
          if (y in lOptions[x]) {
            lOptions[x][y] = options[x][y];
            if (y == "alignment") {
              let ops = options[x][y].split(" ");
              let defs = JSON.parse(
                JSON.stringify(
                  $.fn.addPainterDefaultsOptions.toolbar.alignmentProcessed
                )
              );
              while (ops.length > 0) {
                for (z in defs) {
                  if (defs[z].includes(ops[0])) {
                    lOptions[x]["alignmentProcessed"][z] = ops[0];
                    delete defs[z];
                    ops.shift();
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  painters.push(new Painter(this[0], lOptions));
  return this;
};

let painters = [];

class Painter {
  constructor(domId, options) {
    this.options = options;
    this.editing = false;
    this.first = true;
    this.dom = domId;
    this.ids = {};

    this.Init();
  }

  Init() {
    this.CreateEnviroment();
    if (this.options.type == "dx-scrollview")
      this.CreateCanvas($("#" + this.ids.middlemanId));
    else if (this.options.type == "div" || this.options.type == "img")
      this.CreateCanvas($("#" + this.ids.contentWrapId).children()[0]);

    $("#" + this.ids.editButtonId).on("click", this, function (e) {
      e.data.ClickEditButton();
    });
  }

  ClickEditButton() {
    this.editing = !this.editing;
  }

  CreateEnviroment() {
    this.ids.editButtonId = this.GenerateId("Button");
    this.ids.domId = this.dom.getAttribute("id");
    this.ids.middlemanId = this.GenerateId("Middleman");
    this.ids.canvasId = this.GenerateId("Canvas");
    this.ids.editOptionsId = this.GenerateId("Options");
    this.ids.canvasWrapId = this.GenerateId("CanvasWrap");
    this.ids.contentWrapId = this.GenerateId("ContentWrap");

    if (this.options.type == "dx-scrollview") {
      $(this.dom).append(`<button id="${this.ids.editButtonId}">Edit</button>`);
      this.contentWrap = $("#" + this.ids.domId)
        .find("div")
        .toArray()
        .find((x) => {
          return x.getAttribute("class") == "dx-scrollview-content";
        });
      $(this.contentWrap).html(
        `<div id="${this.ids.middlemanId}">${$(this.contentWrap).html()}</div>`
      );
      $("#" + this.ids.domId).append(
        `<div id="${this.ids.editOptionsId}"></div>`
      );
    } else if (this.options.type == "div" || this.options.type == "img") {
      $("#" + this.ids.domId)
        .parent()
        .html(
          `<div id="${this.ids.middlemanId}"><div id="${
            this.ids.contentWrapId
          }">${$("#" + this.ids.domId)
            .parent()
            .html()}</div></div>`
        );
      $("#" + this.ids.middlemanId).append(
        `<button id="${this.ids.editButtonId}">Edit</button>`
      );
      $("#" + this.ids.contentWrapId).append(
        `<div id="${this.ids.editOptionsId}"></div>`
      );
    }

    $("#" + this.ids.editOptionsId).dxButtonGroup({
      items: canvasButtons,
      keyExpr: "alignment",
      stylingMode: "outlined",
      selectionMode: "single",
    });
    $("#" + this.ids.editOptionsId).css("position", "absolute");

    let defs = JSON.parse(JSON.stringify($.fn.addPainterDefaultsOptions));
    let position = { top: 0, bottom: 0, left: 0, right: 0 };
    let offset = [0, 0];

    if (this.options.type == defs.type[2])
      offset = [
        $("#" + this.ids.domId)
          .parent()
          .width() - $("#" + this.ids.domId).clientWidth,
        $("#" + this.ids.domId)
          .parent()
          .height() - $("#" + this.ids.domId).clientHeight,
      ];

    console.log(
      $("#" + this.ids.domId)
        .parent()
        .width(),
      $("#" + this.ids.domId).clientWidth
    );

    if (
      this.options.toolbar.alignmentProcessed.axis ==
      defs.toolbar.alignmentProcessed.axis[0]
    ) {
      // align horizontaly
      if (
        this.options.toolbar.alignmentProcessed.posToBorder ==
        defs.toolbar.alignmentProcessed.posToBorder[1]
      ) {
        position.top -= $("#" + this.ids.editOptionsId).height();
        position.bottom -= $("#" + this.ids.editOptionsId).height();
      }
    } else if (
      this.options.toolbar.alignmentProcessed.axis ==
      defs.toolbar.alignmentProcessed.axis[1]
    ) {
      // align verticaly
      if (
        this.options.toolbar.alignmentProcessed.posToBorder ==
        defs.toolbar.alignmentProcessed.posToBorder[1]
      ) {
        position.left -= $("#" + this.ids.editOptionsId).width();
        position.right -= $("#" + this.ids.editOptionsId).width();
      }
    }
    console.log(
      position,
      [
        $("#" + this.ids.editOptionsId).width(),
        $("#" + this.ids.editOptionsId).height(),
      ],
      offset
    );
    position.top -= this.options.toolbar.offsets[1] - offset[1];
    position.bottom -= this.options.toolbar.offsets[1] - offset[1];
    position.left -= this.options.toolbar.offsets[0] - offset[0];
    position.right -= this.options.toolbar.offsets[0] - offset[0];
    console.log(position);

    if (
      this.options.toolbar.alignmentProcessed.posX ==
      defs.toolbar.alignmentProcessed.posX[0]
    )
      $("#" + this.ids.editOptionsId).css("left", position.left);
    else if (
      this.options.toolbar.alignmentProcessed.posX ==
      defs.toolbar.alignmentProcessed.posX[1]
    )
      $("#" + this.ids.editOptionsId).css("right", position.right);

    if (
      this.options.toolbar.alignmentProcessed.posY ==
      defs.toolbar.alignmentProcessed.posY[0]
    )
      $("#" + this.ids.editOptionsId).css("top", position.top);
    else if (
      this.options.toolbar.alignmentProcessed.posY ==
      defs.toolbar.alignmentProcessed.posY[1]
    )
      $("#" + this.ids.editOptionsId).css("bottom", position.bottom);

    $(this.ids.editButtonId).addClass("edit-button");
    $("#" + this.ids.middlemanId).addClass("middleman");
    let canvas = `<canvas id="${this.ids.canvasId}"></canvas>`;
    $("#" + this.ids.middlemanId).append(
      `<div id="${this.ids.canvasWrapId}" class="canvas-wrap">${canvas}</div>`
    );
  }

  CreateCanvas(element) {
    this.fCanvas = new fabric.Canvas(this.ids.canvasId);

    this.fCanvas.isDrawingMode = true;
    this.fCanvas.freeDrawingBrush.color = "purple";
    this.fCanvas.freeDrawingBrush.width = 10;

    this.ResizeCanvas(element);
    let param = this.dom;
    new ResizeSensor(jQuery(element), function () {
      let painter = painters.find((painter) => painter.dom == param);
      painter.ResizeCanvas(element);
    });
  }

  ResizeCanvas(element) {
    let size;
    if (this.options.type == "img") {
      size = [element.clientWidth, element.clientHeight];
    } else {
      size = [element.width(), element.height()];
    }
    this.fCanvas.setWidth(size[0]);
    this.fCanvas.setHeight(size[1]);
    this.fCanvas.renderAll();
  }

  GenerateId(element) {
    let res = "";
    for (let i = 0; i < this.options.idNumberLenght; i++) res += "0";
    return element + Math.floor(Math.random() * parseInt("1" + res));
  }
}

$("#content-wrap").addPainter();
