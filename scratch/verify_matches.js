const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const excelPath = path.join(__dirname, '..', 'S_listing--ui--group_096e58cf19cd42d6_0510-170818_default.xls');
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const excelProducts = rawData.filter(row => row['Product Title'] && row['Product Title'] !== 'Title of your product as on Flipkart.com');

const productsJsPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'products.js');
const productsJsContent = fs.readFileSync(productsJsPath, 'utf8');

let mainProductsText = productsJsContent.substring(
  productsJsContent.indexOf('export const PRODUCTS = [') + 'export const PRODUCTS = ['.length,
  productsJsContent.indexOf('export const FRAGRANCE_SAMPLERS =')
).trim();

if (mainProductsText.endsWith('];')) {
  mainProductsText = mainProductsText.slice(0, -2).trim();
}

const trailingProductsText = productsJsContent.substring(
  productsJsContent.indexOf('// Pure Roli Kumkum Powder')
).replace('];', '').trim();

let websiteProducts = [];
try {
  const code = `
    const PRODUCTS = [ ${mainProductsText} , ${trailingProductsText} ];
    return PRODUCTS;
  `;
  websiteProducts = new Function(code)();
} catch (e) {
  console.error("Error evaluating PRODUCTS array:", e);
}

// Function to normalize string
function norm(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

// Comprehensive manual/keyword check rules for Flipkart Excel products to Website products
const results = excelProducts.map((eRow, i) => {
  const title = eRow['Product Title'] || '';
  const sku = eRow['Seller SKU Id'] || '';
  const subcat = eRow['Sub-category'] || '';
  const status = eRow['Listing Status'] || '';
  const mrp = eRow['MRP'];
  const price = eRow['Your Selling Price'];

  const tNorm = norm(title);
  const sNorm = norm(sku);

  let matchedWebProduct = null;
  let matchReason = '';

  for (const w of websiteProducts) {
    const wName = norm(w.name);
    const wId = norm(w.id);
    const wSub = norm(w.subcategory);
    const wCat = norm(w.categoryName);

    // 1. Check SKU / ID overlap
    if (sNorm && (wId.includes(sNorm) || sNorm.includes(wId))) {
      matchedWebProduct = w;
      matchReason = 'SKU / ID match';
      break;
    }

    // 2. Exact or near key phrase match
    // Examples:
    // "Garuda Head" or "Garud Headed"
    if (tNorm.includes('garuda') || tNorm.includes('garud')) {
      if (wName.includes('garud') || wId.includes('garuda')) {
        matchedWebProduct = w; matchReason = 'Garuda Bell'; break;
      }
    }
    if (tNorm.includes('nandi') && (tNorm.includes('bell') || tNorm.includes('ghanti'))) {
      if (wName.includes('nandi') || wId.includes('nandi')) {
        matchedWebProduct = w; matchReason = 'Nandi Bell'; break;
      }
    }
    if (tNorm.includes('tulsi') && (tNorm.includes('mala') || tNorm.includes('kanthi'))) {
      if (wName.includes('tulsi mala') || wId.includes('tulsi-mala')) {
        matchedWebProduct = w; matchReason = 'Tulsi Mala'; break;
      }
    }
    if (tNorm.includes('karungali')) {
      if (wName.includes('karungali') || wId.includes('karungali')) {
        matchedWebProduct = w; matchReason = 'Karungali Mala'; break;
      }
    }
    if (tNorm.includes('sphatik') && tNorm.includes('mala')) {
      if (wName.includes('sphatik mala') || wId.includes('sphatik-mala')) {
        matchedWebProduct = w; matchReason = 'Sphatik Mala'; break;
      }
    }
    if (tNorm.includes('sphatik') && tNorm.includes('shivling')) {
      if (wName.includes('sphatik shivling') || wId.includes('sphatik-shivling')) {
        matchedWebProduct = w; matchReason = 'Sphatik Shivling'; break;
      }
    }
    if (tNorm.includes('rudraksha') && tNorm.includes('mala')) {
      if (wName.includes('rudraksha mala') || wId.includes('rudraksha-mala')) {
        matchedWebProduct = w; matchReason = 'Rudraksha Mala'; break;
      }
    }
    if (tNorm.includes('radha krishna')) {
      if (wName.includes('radha krishna') || wId.includes('radha-krishna')) {
        matchedWebProduct = w; matchReason = 'Radha Krishna Statue'; break;
      }
    }
    if (tNorm.includes('kamandal')) {
      if (wName.includes('kamandal') || wId.includes('kamandal')) {
        matchedWebProduct = w; matchReason = 'Kamandal'; break;
      }
    }
    if (tNorm.includes('chowki') && (tNorm.includes('15x15') || tNorm.includes('15'))) {
      if (wId.includes('chowki') || wName.includes('chowki')) {
        matchedWebProduct = w; matchReason = 'Pooja Chowki'; break;
      }
    }
    if (tNorm.includes('panchmukhi') && tNorm.includes('diya')) {
      if (wName.includes('panchmukhi') || wId.includes('panchmukhi')) {
        matchedWebProduct = w; matchReason = 'Panchmukhi Diya'; break;
      }
    }
    if (tNorm.includes('loban') && (tNorm.includes('resin') || tNorm.includes('granules') || tNorm.includes('dhoop'))) {
      if (wId.includes('loban') || wName.includes('loban')) {
        matchedWebProduct = w; matchReason = 'Loban Dhoop'; break;
      }
    }
    if (tNorm.includes('kumkum') || tNorm.includes('roli')) {
      if (wId.includes('kumkum') || wName.includes('kumkum')) {
        matchedWebProduct = w; matchReason = 'Pure Kumkum'; break;
      }
    }
    if (tNorm.includes('lal chandan') || tNorm.includes('red sandalwood')) {
      if (wId.includes('lal-chandan') || wName.includes('lal chandan')) {
        matchedWebProduct = w; matchReason = 'Lal Chandan'; break;
      }
    }
    if (tNorm.includes('safed chandan') || tNorm.includes('white sandalwood')) {
      if (wId.includes('white-sandalwood') || wName.includes('white sandalwood') || wName.includes('safed chandan')) {
        matchedWebProduct = w; matchReason = 'Safed Chandan'; break;
      }
    }
    if (tNorm.includes('chandan agarbatti') || (tNorm.includes('sandalwood') && tNorm.includes('incense sticks'))) {
      if (wId.includes('sandalwood-agarbatti') || (wName.includes('sandalwood') && wName.includes('incense'))) {
        matchedWebProduct = w; matchReason = 'Sandalwood Agarbatti'; break;
      }
    }
    if (tNorm.includes('lavender') && tNorm.includes('agarbatti')) {
      if (wId.includes('lavender-incense') || (wName.includes('lavender') && wName.includes('incense'))) {
        matchedWebProduct = w; matchReason = 'Lavender Agarbatti'; break;
      }
    }
    if (tNorm.includes('kesar') && tNorm.includes('incense')) {
      if (wId.includes('kesar-incense') || (wName.includes('kesar') && wName.includes('incense'))) {
        matchedWebProduct = w; matchReason = 'Kesar Agarbatti'; break;
      }
    }
    if (tNorm.includes('dhoop dani') || tNorm.includes('incense holder')) {
      if (wId.includes('dhoopdani') || wName.includes('dhoop dani')) {
        matchedWebProduct = w; matchReason = 'Dhoop Dani'; break;
      }
    }
    if (tNorm.includes('tally counter')) {
      if (wId.includes('counter') || wName.includes('counter')) {
        matchedWebProduct = w; matchReason = 'Tally Counter'; break;
      }
    }
    if (tNorm.includes('panchpatra')) {
      if (wId.includes('panchpatra') || wName.includes('panchpatra')) {
        matchedWebProduct = w; matchReason = 'Panchpatra'; break;
      }
    }
    if (tNorm.includes('copper') && tNorm.includes('thali')) {
      if (wId.includes('copper-puja-thali') || (wName.includes('copper') && wName.includes('thali'))) {
        matchedWebProduct = w; matchReason = 'Copper Thali'; break;
      }
    }
    if (tNorm.includes('ganesh yantra') || tNorm.includes('ganesh') && tNorm.includes('yantra')) {
      if (wId.includes('ganesh') && wId.includes('yantra')) {
        matchedWebProduct = w; matchReason = 'Ganesh Yantra'; break;
      }
    }
    if (tNorm.includes('lakshmi yantra') || tNorm.includes('laxmi yantra')) {
      if (wId.includes('laxmi') && wId.includes('yantra')) {
        matchedWebProduct = w; matchReason = 'Lakshmi Yantra'; break;
      }
    }
    if (tNorm.includes('kuber yantra')) {
      if (wId.includes('kuber') && wId.includes('yantra')) {
        matchedWebProduct = w; matchReason = 'Kuber Yantra'; break;
      }
    }
    if (tNorm.includes('saraswati yantra')) {
      if (wId.includes('saraswati') && wId.includes('yantra')) {
        matchedWebProduct = w; matchReason = 'Saraswati Yantra'; break;
      }
    }
    if (tNorm.includes('mahamrityunjay')) {
      if (wId.includes('mahamrityunjay') || wName.includes('mahamrityunjay')) {
        matchedWebProduct = w; matchReason = 'Mahamrityunjay Yantra'; break;
      }
    }
    if (tNorm.includes('kaal sarp')) {
      if (wId.includes('kaal-sarp') || wName.includes('kaal sarp')) {
        matchedWebProduct = w; matchReason = 'Kaal Sarp Yantra'; break;
      }
    }
    if (tNorm.includes('mangal yantra')) {
      if (wId.includes('mangal') || wName.includes('mangal')) {
        matchedWebProduct = w; matchReason = 'Mangal Yantra'; break;
      }
    }
    if (tNorm.includes('akhand jyot')) {
      if (wId.includes('akhand-jyot') || wName.includes('akhand jyot')) {
        matchedWebProduct = w; matchReason = 'Akhand Jyot'; break;
      }
    }
    if (tNorm.includes('trishul')) {
      if (wId.includes('trishul') || wName.includes('trishul')) {
        matchedWebProduct = w; matchReason = 'Brass Trishul'; break;
      }
    }
    if (tNorm.includes('shree yantra cone') || (tNorm.includes('glass') && tNorm.includes('shree yantra'))) {
      if (wId.includes('shree-yantra') || wName.includes('shree yantra')) {
        matchedWebProduct = w; matchReason = 'Shree Yantra Cone'; break;
      }
    }
    if (tNorm.includes('camphor fly cone') || tNorm.includes('potpourri camphor')) {
      if (wId.includes('camphor-cone') || wName.includes('camphor cone')) {
        matchedWebProduct = w; matchReason = 'Camphor Fly Cone'; break;
      }
    }
    if (tNorm.includes('cow dung cake') || tNorm.includes('upla') || tNorm.includes('gobar')) {
      if (wId.includes('cow-dung') || wName.includes('cow dung') || wName.includes('gobar')) {
        matchedWebProduct = w; matchReason = 'Cow Dung Cake'; break;
      }
    }
    if (tNorm.includes('camphor kapoor') || tNorm.includes('pure camphor')) {
      if (wId.includes('camphor') || wName.includes('camphor')) {
        matchedWebProduct = w; matchReason = 'Pure Camphor'; break;
      }
    }
    if (tNorm.includes('dhoop cups') || tNorm.includes('chandan dhoop') || tNorm.includes('rose dhoop') || tNorm.includes('guggul sambrani')) {
      if (wId.includes('dhoop-cup') || wName.includes('dhoop cup') || wId.includes('sambrani') || wName.includes('sambrani')) {
        matchedWebProduct = w; matchReason = 'Dhoop Cups / Sambrani'; break;
      }
    }
    if (tNorm.includes('peacock') && tNorm.includes('thali')) {
      if (wId.includes('peacock-thali') || wName.includes('peacock')) {
        matchedWebProduct = w; matchReason = 'Peacock Thali'; break;
      }
    }
    if (tNorm.includes('brass pooja thali') || tNorm.includes('bhog thali')) {
      if (wId.includes('brass-pooja-thali') || wName.includes('thali')) {
        matchedWebProduct = w; matchReason = 'Brass Thali'; break;
      }
    }
    if (tNorm.includes('diya set of 5') || (tNorm.includes('diya') && tNorm.includes('set'))) {
      if (wId.includes('brass-diya-set') || wName.includes('diya set')) {
        matchedWebProduct = w; matchReason = 'Diya Set'; break;
      }
    }
    if (tNorm.includes('mandir dabbi') || tNorm.includes('pooja box')) {
      if (wId.includes('dabbi') || wName.includes('dabbi') || wName.includes('pooja box')) {
        matchedWebProduct = w; matchReason = 'Mandir Dabbi'; break;
      }
    }
    if (tNorm.includes('kalash lota') || tNorm.includes('brass pooja kalash')) {
      if (wId.includes('kalash') || wName.includes('kalash')) {
        matchedWebProduct = w; matchReason = 'Brass Kalash'; break;
      }
    }
    if (tNorm.includes('footprint')) {
      if (wId.includes('footprint') || wName.includes('footprint') || wName.includes('charan')) {
        matchedWebProduct = w; matchReason = 'Laxmi Footprint'; break;
      }
    }
  }

  return {
    index: i + 1,
    sku,
    title,
    subcat,
    status,
    mrp,
    price,
    matched: !!matchedWebProduct,
    matchedWebProduct,
    matchReason
  };
});

const missingItems = results.filter(r => !r.matched);
const matchedItems = results.filter(r => r.matched);

console.log(`TOTAL EXCEL ITEMS: ${results.length}`);
console.log(`MATCHED ON WEBSITE: ${matchedItems.length}`);
console.log(`MISSING FROM WEBSITE: ${missingItems.length}`);

console.log("\n===============================================");
console.log("DETAILED LIST OF MISSING PRODUCTS (NOT ON WEBSITE):");
console.log("===============================================");
missingItems.forEach((item, idx) => {
  console.log(`\n[${idx + 1}] SKU: ${item.sku}`);
  console.log(`    Title: ${item.title}`);
  console.log(`    Sub-Category: ${item.subcat}`);
  console.log(`    Listing Status: ${item.status}`);
  console.log(`    Selling Price: ₹${item.price} (MRP: ₹${item.mrp})`);
});
