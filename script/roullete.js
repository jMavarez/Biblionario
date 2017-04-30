$(function () {
    var initialValues = [
        "PASTOR",
        "EQUIPO",
        "GENTE",
        "COMODÍN"
    ];

    var bombillo_url = "../img/bombillo_blanco.png";
    var kappa_url = "../img/kappa.png";
    var totalOptionMultiplier = 3;
    var logoBackground;

    var kappa;
    var isKappaEnabled = false;
    var quack;
    var aloh;

    var isSpinning = false;
    var scaleFactor = .17;
    var fontColor = "#FAFAFA";
    var blueTeam = '#008DDA';
    var color = ["#F44336", "#2196F3", "#FDD835", "#FF9800"];
    var maxSecondsRun = "5000";
    var arrowColor = ["#FFFFFF", "#FFFFFF", 4];
    var strokeWidth = 1;
    var random = [744, 3478];

    var width = $(document).width();
    var height = $(document).height();
    var rOuter = height / 2.10;
    var rInner = rOuter * .30;

    var arrow = null;
    var sections = [];
    var labels = [];

    var fontSize = null;
    var selected = null;

    var curvePoint = Math.PI / 180;

    var paper = Raphael(0, 0, width, height);

    var center = {
        x: width / 2,
        y: height / 2
    };

    var setupArray = function () {
        var array = [];
        for (var i = 0; i < initialValues.length * totalOptionMultiplier; i++) {
            array.push(initialValues[i % initialValues.length]);
        }

        return array;
    }

    var init = function () {
        quack = document.getElementById("quack");
        aloh = document.getElementById("aloh");

        drawRoullete();
        arrow = drawArrow();

        logoBackground = paper.circle(center.x, center.y, rInner + 15).attr("fill", "#008DDA");
        logoBackground.toBack();

        var bombilloImg = new Image();
        bombilloImg.src = bombillo_url;

        bombilloImg.onload = function () {
            var bombillo = paper.image(
                bombillo_url,
                center.x - bombilloImg.width / 7,
                center.y - bombilloImg.height / 7,
                bombilloImg.width / 3.5,
                bombilloImg.height / 3.5
            );
        };

        if (isKappaEnabled) {
            var kappaImg = new Image();
            kappaImg.src = kappa_url;

            kappaImg.onload = function () {
                kappa = paper.image(
                    kappa_url,
                    center.x - kappaImg.width / 7 - 15,
                    center.y - kappaImg.height / 7 - 7,
                    kappaImg.width / 3.25,
                    kappaImg.height / 3.25
                );
                kappa.node.zIndex = 90
                kappa.hide();
            };
        }
    };

    var drawRoullete = function () {
        var beginAngle = 0;
        var endAngle = sectionAngle;

        for (var i = 0; i < options.length; i++) {
            var option = options[i];

            var points = getPoints(center.x, center.y, rOuter, rInner, beginAngle, endAngle);
            var edgeStart = drawSectionBorder(points, true);
            var arc1 = drawArc(rOuter, beginAngle, endAngle, points);
            var edgeEnd = drawSectionBorder(points, false);

            var section = paper.path(edgeStart + arc1 + edgeEnd + " z").attr({
                stroke: color[i % color.length],
                "stroke-width": strokeWidth,
                "stroke-linejoin": 'round',
                fill: color[i % color.length]
            });

            section.toBack();
            section.node.id = 'section-' + i;
            section.node.zIndex = 0;

            if (i === 0) {
                getFontScale(section.getBBox().width);
            }

            sections[i] = section;

            var label = drawLabel(options[i], beginAngle + sectionAngle / 2, i);
            label.toFront();
            label.node.id = "label-" + i;
            labels[i] = label;

            beginAngle = endAngle;
            endAngle += sectionAngle;
        }
    };

    var getFontScale = function (_size) {
        var scaleSource = _size;
        fontSize = scaleSource * scaleFactor;
    };

    var getPoints = function (centerX, centerY, rOuter, rInner, startAngle, endAngle) {
        var points = {};
        points.inner = {};
        points.outer = {};

        points.inner.x1 = center.x + rInner * Math.cos(startAngle * curvePoint);
        points.inner.y1 = center.y + rInner * Math.sin(startAngle * curvePoint);
        points.inner.x2 = center.x + rInner * Math.cos(endAngle * curvePoint);
        points.inner.y2 = center.y + rInner * Math.sin(endAngle * curvePoint);

        points.outer.x1 = center.x + rOuter * Math.cos(startAngle * curvePoint);
        points.outer.y1 = center.y + rOuter * Math.sin(startAngle * curvePoint);
        points.outer.x2 = center.x + rOuter * Math.cos(endAngle * curvePoint);
        points.outer.y2 = center.y + rOuter * Math.sin(endAngle * curvePoint);

        return points;
    };

    var drawSectionBorder = function (points, isLeftBorder) {
        var _edge;
        if (isLeftBorder) {
            _edge = 'M' + points.inner.x1 + ' ' + points.inner.y1 + "L" + points.outer.x1 + ' ' + points.outer.y1;
        } else {
            _edge = 'L' + points.inner.x2 + ' ' + points.inner.y2;
        }
        return _edge;
    };

    var drawCircle = function () {
        var circle = paper.circle(center.x, center.y, rOuter);
        circle.attr({
            "stroke": "#E1E1E1",
            "stroke-width": strokeWidth
        });
        circle.id = "circle";
    };

    var drawArrow = function () {
        var arrowWidth = rOuter / 7;
        var arrowHeight = arrowWidth / 3;
        var arrow = paper.path("M" + (center.x + rOuter - arrowHeight - 10) + " " + center.y + "l " + arrowWidth + " -" + arrowHeight + " l 0 " + (arrowHeight * 2) + " z").attr({
            stroke: arrowColor[1],
            "stroke-width": 4,
            'stroke-linejoin': 'round',
            fill: arrowColor[0]
        });
        arrow.toFront();
        arrow.node.id = "arrow";
        arrow.node.zIndex = 100;
        return arrow;
    };

    var drawLabel = function (label, angle, points, i) {
        var attr = {
            font: fontSize + 'px Arial, Helvetica',
            "text-anchor": 'start',
            fill: fontColor,
            "font-weight": "bold"
        };

        var text = paper.text(center.x + rInner + 10, center.y, label).attr(attr);
        text.node.id = 'text' + i;
        text.node.zIndex = 10;
        text.rotate(angle, center.x, center.y);
        return text;
    };

    var drawArc = function (radius, startAngle, endAngle, points) {
        return circularArcPath(radius, startAngle, endAngle, points);
    };

    var arcPath = function (startX, startY, endX, endY, radius1, radius2, angle) {
        var arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(' ');
        return " a " + arcSVG;
    };

    var circularArcPath = function (radius, startAngle, endAngle, points) {
        return arcPath(points.outer.x1, points.outer.y1, points.outer.x2 - points.outer.x1, points.outer.y2 - points.outer.y1, radius, radius, 0);
    };

    var randomFromTo = function () {
        var number = Math.floor(Math.random() * (random[0] - random[1]) + random[1]);
        return number;
    };

    var highlight = function () {
        isSpinning = false;
        console.log('finish spin');

        var section = document.elementFromPoint(center.x + rInner + 5, center.y);

        if (section.raphael) {
            selected = section.raphael;
            var label = document.getElementById("label-" + section.id.split("-")[1]);
            arrow.hide();
            section.raphael.toFront();
            label.raphael.toFront();

            if (label.raphael[0].textContent === initialValues[3]) {
                quack.play();
                if (isKappaEnabled) {
                    kappa.show();
                }
            } else if (label.raphael[0].textContent === initialValues[0]) {
                aloh.play();
            }

            section.raphael.animate({ "stroke-width": 70 }, 1500, "elastic");
        }
    };

    var spin = function (data) {
        isSpinning = true;

        if (isKappaEnabled)
            kappa.hide();

        if (data.random) {
            var degree = randomFromTo();

            if (selected) {
                selected.attr({
                    "stroke-width": strokeWidth
                });

                arrow.show();
                var label = document.getElementById("label-" + selected.node.id.split("-")[1]);
                selected.toBack();
                logoBackground.toBack();
            }

            for (var z = 0; z < options.length; z++) {
                if (sections[z].attr("rotation")) {
                    if (z === 0) {
                        sections[z].stop().animate({ rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>', highlight);
                    } else {
                        sections[z].stop().animateWith(sections[0], { rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>');
                    }
                } else {
                    if (z === 0) {
                        sections[z].stop().animate({ rotation: degree + " " + center.x + " " + center.y }, maxSecondsRun, '>', highlight);
                    }
                    else {
                        sections[z].stop().animateWith(sections[0], { rotation: degree + " " + center.x + " " + center.y }, maxSecondsRun, '>');
                    }
                }
            }

            for (var j = 0; j < options.length; j++) {
                labels[j].stop().animateWith(sections[0], { rotation: (degree + +labels[j].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>');
            }
        } else {
            var degree = getOptionAngle(data.selected);
            var section = document.elementFromPoint(center.x + rInner + 2, center.y);

            // Debug Indicator
            // var x = center.x + rOuter * Math.cos(degree * (Math.PI / 180));
            // var y = center.y + rOuter * Math.sin(degree * (Math.PI / 180));
            // var debugIndicator = paper.circle(x, y, 5).attr("fill", "#FF0000");

            if (selected) {
                selected.attr({
                    "stroke-width": strokeWidth
                });

                arrow.show();
                var label = document.getElementById("label-" + selected.node.id.split("-")[1]);
                selected.toBack();
                logoBackground.toBack();
            }

            for (var z = 0; z < options.length; z++) {
                if (sections[z].attr("rotation")) {
                    if (z === 0) {
                        sections[z].stop().animate({ rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>', highlight);
                    } else {
                        sections[z].stop().animateWith(sections[0], { rotation: (degree + +sections[z].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>');
                    }
                } else {
                    if (z === 0) {
                        sections[z].stop().animate({ rotation: degree + " " + center.x + " " + center.y }, maxSecondsRun, '>', highlight);
                    }
                    else {
                        sections[z].stop().animateWith(sections[0], { rotation: degree + " " + center.x + " " + center.y }, maxSecondsRun, '>');
                    }
                }
            }

            for (var j = 0; j < options.length; j++) {
                labels[j].stop().animateWith(sections[0], { rotation: (degree + +labels[j].attr("rotation").split(" ").shift()) + " " + center.x + " " + center.y }, maxSecondsRun, '>');
            }
        }
    };

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    var getOptionAngle = function (selectedOption) {
        var selectionGroup = [];

        for (var i = 0; i < labels.length; i++) {
            var element = labels[i];
            if (element['0'].textContent === selectedOption) {
                selectionGroup.push(element);
            }
        }

        var randomIndex = getRandomInt(0, (selectionGroup.length - 1));
        var elementGoTo = selectionGroup[randomIndex];
        var angle = elementGoTo.attr("rotation").split(" ")[0];

        var angle = (360 * 4) - angle;

        while (angle < 0 || angle < 360) {
            angle += 360 * 4;
        }

        return angle - getRandomInt(-14, 14);
    };

    var options = setupArray();
    var sectionAngle = 360 / options.length;

    init();

    // Electron mainRenderer
    require('electron').ipcRenderer.on('roullete-selection', function (event, message) {
        if (!isSpinning)
            spin(message);
        else console.log('isSpinning');
    });
});