let voltage = 0;
let resistance = 0;
let isSerialSlotFilled = false;
let isParallelSlotFilled = false;
let isSwitchOn = false;

function updateVoltageValue(val) {
    voltage = parseFloat(val);
    document.getElementById("voltageSlider").textContent = val;
    calculateIfNeeded();
}

function updateResistanceValue(val) {
    resistance = parseFloat(val);
    document.getElementById("resistanceSlider").textContent = val;
    calculateIfNeeded();
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var element = document.getElementById(data);

    if (event.target.tagName === "IMG") {
        event.target.src = element.src;
    } else {
        event.target.innerHTML = "";
        var clonedElement = element.cloneNode(true);
        clonedElement.draggable = false;
        clonedElement.style.width = '100%';  
        clonedElement.style.height = '100%';
        event.target.appendChild(clonedElement);

        let dropArea = '';
        if (event.target.classList.contains('serial-drop-area1') || event.target.classList.contains('serial-drop-area2')) {
            isSerialSlotFilled = true;
            dropArea = 'serial';
            if (isSwitchOn) {
                changeLightBulbImage(event.target, 'on');
            }
            event.target.classList.add('active');
        } else if (event.target.classList.contains('parallel-drop-area1') || event.target.classList.contains('parallel-drop-area2')) {
            isParallelSlotFilled = true;
            dropArea = 'parallel';
            if (isSwitchOn) {
                changeLightBulbImage(event.target, 'on');
            }
            event.target.classList.add('active');
        }

        console.log(`Dropped into ${dropArea} area.`);

        calculateIfNeeded();
    }
}

function changeLightBulbImage(dropTarget, state) { 
    const lightBulbImage = dropTarget.querySelector('img');
    if (lightBulbImage && lightBulbImage.id === "lightBulb") {
        if (state === 'on') {
            lightBulbImage.src = '../img/lightbulb-on.png'; 
        } else {
            lightBulbImage.src = '../img/lightbulb-off.png';
        }
    }
}

function calculateIfNeeded() {
    if (isSwitchOn && (isSerialSlotFilled || isParallelSlotFilled)) {
        const circuitType = isSerialSlotFilled ? 'series' : 'parallel';
        calculateCurrent(circuitType);
    }
}

function calculateCurrent(circuitType) {
    let totalResistance;

    if (circuitType === 'series') {
        totalResistance = resistance + resistance; 
    } else if (circuitType === 'parallel') {
        if (resistance !== 0) {
            totalResistance = 1 / ((1 / resistance) + (1 / resistance)); 
        } else {
            totalResistance = Infinity; 
        }
    }

    let current = totalResistance === 0 ? 0 : voltage / totalResistance;

    document.getElementById("resultArus").textContent = current.toFixed(3); 
    console.log(`Circuit Type: ${circuitType}, Voltage: ${voltage} V, Resistance: ${totalResistance} Ω, Current: ${current.toFixed(2)} A`);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("switch").addEventListener("change", function() {
        isSwitchOn = this.checked;
        const lightBulbContainers = document.querySelectorAll('.serial-drop-area1, .serial-drop-area2, .parallel-drop-area1, .parallel-drop-area2');
        lightBulbContainers.forEach(container => {
            changeLightBulbImage(container, isSwitchOn ? 'on' : 'off');
        });

        if (!isSwitchOn) {
            document.getElementById("resultArus").textContent = "0";
        } else {
            calculateIfNeeded();
        }
    });
});

function swapPage(clicked) {
    var serialBtn = document.getElementById('serial-btn');
    var parallelBtn = document.getElementById('parallel-btn');
    var serialArea = document.getElementById('serialArea');
    var serialBackground = document.getElementById('serialBackground');
    var parallelArea = document.getElementById('parallelArea');
    var parallelBackground = document.getElementById('parallelBackground');

    if (clicked === 'serial') {
        serialBtn.classList.add('active');
        parallelBtn.classList.remove('active');
        serialArea.classList.add('active');
        serialBackground.classList.add('active');
        parallelArea.classList.remove('active');
        parallelBackground.classList.remove('active');
        // clear serial
    } else if (clicked === 'parallel') {
        parallelBtn.classList.add('active');
        serialBtn.classList.remove('active');
        serialArea.classList.remove('active');
        serialBackground.classList.remove('active');
        parallelArea.classList.add('active');
        parallelBackground.classList.add('active');
        // clear parallel
    }
}