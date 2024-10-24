let voltage = 0;
let resistance = 0;
let isSerialSlotFilled1 = false; 
let isSerialSlotFilled2 = false; 
let isParallelSlotFilled1 = false; 
let isParallelSlotFilled2 = false; 
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

        if (event.target.classList.contains('serial-drop-area1')) {
            isSerialSlotFilled1 = true;
            event.target.classList.add('active');
        } else if (event.target.classList.contains('serial-drop-area2')) {
            isSerialSlotFilled2 = true;
            event.target.classList.add('active');
        } else if (event.target.classList.contains('parallel-drop-area1')) {
            isParallelSlotFilled1 = true;
            event.target.classList.add('active');
        } else if (event.target.classList.contains('parallel-drop-area2')) {
            isParallelSlotFilled2 = true;
            event.target.classList.add('active');
        }

        console.log(`Serial Slot 1: ${isSerialSlotFilled1}, Serial Slot 2: ${isSerialSlotFilled2}`);
        console.log(`Parallel Slot 1: ${isParallelSlotFilled1}, Parallel Slot 2: ${isParallelSlotFilled2}`);

        checkConditionsAndToggleLight();
    }
}

function changeLightBulbImage(dropTarget, state) {
    const lightBulbImage = dropTarget.querySelector('img');
    if (lightBulbImage && lightBulbImage.id === "lightBulb") {
        lightBulbImage.src = state === 'on' ? '../img/lightbulb-on.png' : '../img/lightbulb-off.png';
    }
}

function checkConditionsAndToggleLight() {
    if (resistance > 0 && voltage> 0 && isSwitchOn && voltage > 0) {
        if ((isSerialSlotFilled1 && isSerialSlotFilled2) || (isParallelSlotFilled1 && isParallelSlotFilled2)) {
            const lightBulbContainers = document.querySelectorAll('.serial-drop-area1, .serial-drop-area2, .parallel-drop-area1, .parallel-drop-area2');
            lightBulbContainers.forEach(container => {
                changeLightBulbImage(container, 'on');
            });
            calculateCurrent();
        } else {
            turnOffLightBulbs();
        }
    } else {
        turnOffLightBulbs();
    }
}

function turnOffLightBulbs() {
    const lightBulbContainers = document.querySelectorAll('.serial-drop-area1, .serial-drop-area2, .parallel-drop-area1, .parallel-drop-area2');
    lightBulbContainers.forEach(container => {
        changeLightBulbImage(container, 'off');
    });
}

function calculateCurrent() {
    let totalResistance;
    if (isSerialSlotFilled1 && isSerialSlotFilled2) {
        totalResistance = resistance * 2;
    } else if (isParallelSlotFilled1 && isParallelSlotFilled2) {
        if (resistance !== 0) {
            totalResistance = 1 / ((1 / resistance) + (1 / resistance)); 
        } else {
            totalResistance = Infinity;
        }
    }

    let current = totalResistance === 0 ? 0 : voltage / totalResistance;

    document.getElementById("resultArus").textContent = current.toFixed(3);
    console.log(`Voltage: ${voltage} V, Total Resistance: ${totalResistance} Ω, Current: ${current.toFixed(2)} A`);
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("switch").addEventListener("change", function() {
        isSwitchOn = this.checked;
        checkConditionsAndToggleLight();
        if (!isSwitchOn) {
            document.getElementById("resultArus").textContent = "0";
        }
    });
    document.getElementById("voltage-slider").addEventListener("input", function() {
        voltage = parseFloat(this.value);
        document.getElementById("voltageSlider").textContent = voltage;
        checkConditionsAndToggleLight();
    });
    document.getElementById("resistance-slider").addEventListener("input", function() {
        resistance = parseFloat(this.value);
        document.getElementById("resistanceSlider").textContent = resistance;
        checkConditionsAndToggleLight();
    });
});

function clearSerialSlots() {
    document.querySelectorAll('.serial-drop-area1, .serial-drop-area2').forEach(slot => {
        slot.innerHTML = "";
        slot.classList.remove('active');
    });
    isSerialSlotFilled1 = false;
    isSerialSlotFilled2 = false;
    turnOffLightBulbs();
}

function clearParallelSlots() {
    document.querySelectorAll('.parallel-drop-area1, .parallel-drop-area2').forEach(slot => {
        slot.innerHTML = "";
        slot.classList.remove('active');
    });
    isParallelSlotFilled1 = false;
    isParallelSlotFilled2 = false;
    turnOffLightBulbs();
}

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
        clearParallelSlots();
    } else if (clicked === 'parallel') {
        parallelBtn.classList.add('active');
        serialBtn.classList.remove('active');
        serialArea.classList.remove('active');
        serialBackground.classList.remove('active');
        parallelArea.classList.add('active');
        parallelBackground.classList.add('active');
        clearSerialSlots();
    }
    
    document.getElementById('switch').checked = false;
    isSwitchOn = false;
    turnOffLightBulbs();
    document.getElementById("resultArus").textContent = "0";
}
