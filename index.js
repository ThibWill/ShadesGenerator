function generateShades(color) {
  const colors = extractColor(color);

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

function extractColor(color) {
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
  return Array.from(Array(10), (_e, i) => rgb.map(colorUnit => Math.round(colorUnit * i / 10)));
}

function calculateBrighterShades(rgb) {
  const unitsRGB = rgb.map(colorUnit => Math.floor((255 - colorUnit) / 10));
  return Array.from(Array(10), (_e, i) => rgb.map((colorUnit, index) => Math.round(colorUnit + unitsRGB[index] * (i + 1))));
}

function shadeElementDom(color) {
  const shadeDom = document.createElement('div');
  shadeDom.style.width = '50px';
  shadeDom.style.height = '50px';
  shadeDom.style.background = color;
  return shadeDom;
}

function shadesDom(color) {
  const { colorDarkerShades, colorBrighterShades } = generateShades(color);

  const shadesDom = document.getElementById('darkerShades');
  const brigtherDom = document.getElementById('brighterShades');
  while (shadesDom.firstChild) {
    shadesDom.removeChild(shadesDom.lastChild);
  }
  while (brigtherDom.firstChild) {
    brigtherDom.removeChild(brigtherDom.lastChild);
  }

  for (let i = 0; i < colorDarkerShades.length; i++) {
    const shadeDom = shadeElementDom(colorDarkerShades[i]);
    shadesDom.appendChild(shadeDom);
  }

  for (let i = 0; i < colorBrighterShades.length; i++) {
    const shadeDom = shadeElementDom(colorBrighterShades[i]);
    brigtherDom.appendChild(shadeDom);
  }
};

(function() {
  const colorInput = document.getElementById('colorInput');
  colorInput.addEventListener('change', (e) => {
    shadesDom(e.target.value);
  });
})()