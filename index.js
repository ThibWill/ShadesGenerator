function generateShades(color) {
  const colors = validateAndExtractColor(color);

  if (!colors) {
    console.error('Bad color input');
    return;
  }

  const rgb = colors.map(colorUnit => parseInt(colorUnit, 16));
  
  const darkerShades = calculateDarkerShades(rgb);
  const brigtherShades = calculateBrighterShades(rgb);

  const colorDarkerShades = darkerShades.map(shade => shade.reduce(
    (acc, curr) => acc + (curr.toString(16).length > 1 ? curr.toString(16) : '0' + curr.toString(16))
  , '#'));
  const colorBrighterShades = brigtherShades.map(shade => shade.reduce(
    (acc, curr) => acc + (curr.toString(16).length > 1 ? curr.toString(16) : '0' + curr.toString(16))
  , '#'));

  return {
    colorDarkerShades,
    colorBrighterShades
  };
}

function validateAndExtractColor(color) {
  const pattern1 = new RegExp(/^#[0-9a-fA-F]{6}$/);

  if (color.match(pattern1)) {
    const red = color.slice(1, 3);
    const green = color.slice(3, 5);
    const blue = color.slice(5, 7);
    return [red, green, blue];
  }

  return false;
}

function calculateDarkerShades(rgb) {
  return Array.from(Array(10), (_e, i) => rgb.map(colorUnit => Math.round(colorUnit * (10 - i) / 10)));
}

function calculateBrighterShades(rgb) {
  const unitsRGB = rgb.map(colorUnit => Math.floor((255 - colorUnit) / 10));
  return Array.from(Array(10), (_e, i) => rgb.map((colorUnit, index) => Math.round(colorUnit + unitsRGB[index] * (i + 1))));
}

function DomShadesOperations() {
  const shadesDom = document.getElementById('darkerShades');
  const brigtherDom = document.getElementById('brighterShades');

  function removeAllChildrenElement(element) {
    while (element.firstChild) {
      element.removeChild(element.lastChild);
    }
  }

  function colorElement(color) {
    const shadeDom = document.createElement('div');
    shadeDom.style.width = '150px';
    shadeDom.style.height = '60px';
    shadeDom.style.borderRadius = '10px';
    shadeDom.style.background = color;
    return shadeDom;
  }

  function fillColors(element, colors) {
    for (let i = 0; i < colors.length; i++) {
      const shadeDom = colorElement(colors[i]);
      element.appendChild(shadeDom);
    }
  }

  function buildColors(color) {
    const { colorDarkerShades, colorBrighterShades } = generateShades(color);

    removeAllChildrenElement(shadesDom);
    removeAllChildrenElement(brigtherDom);

    fillColors(shadesDom, colorDarkerShades);
    fillColors(brigtherDom, colorBrighterShades);
  }

  return buildColors;
}

(function() {
  const colorInput = document.getElementById('colorInput');
  const domShadesOperations = DomShadesOperations();
  colorInput.addEventListener('change', (e) => {
    domShadesOperations(e.target.value);
  });
})()