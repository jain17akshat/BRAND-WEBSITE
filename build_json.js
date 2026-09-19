const fs = require('fs');

const markdownTable = `
|  # | Product                                       | SKU                       |   HSN Code |   GST Rate |
| -: | --------------------------------------------- | ------------------------- | ---------: | ---------: |
|  1 | SHRAVIKO SarvKarya Siddhi Yantra – Copper     | SHR-NMY-COP-003           | 74199990   |        18% |
|  2 | Chandan Sandalwood Bamboo-Free Incense Sticks | SHR-CHN6                  | 33074100   |         5% |
|  3 | SHR-L-01 (100 g)                              | SHR-L-01                  | 33042000   |        18% |
|  4 | SHR-SAF-1 (100 g)                             | SHR-SAF-1                 | 33042000   |        18% |
|  5 | SHR-CAM-01 (100 g)                            | SHR-CAM-01                | 29142100   |        18% |
|  6 | Rose Incense Sticks (100 g)                   | SHR-RSE-4                 | 33074100   |         5% |
|  7 | Shri Baglamukhi Mahayantra – Copper           | SHR-BAG-001               | 74199990   |        18% |
|  8 | Mangal Yantra – Copper 3×3 Inch               | SHR-MY-04                 | 74199990   |        18% |
|  9 | Guggul Sambrani Cups                          | SH-G-15                   | 33074100   |         5% |
| 10 | SHR-CM-01 (200 g)                             | SHR-CM-01                 | 33074100   |         5% |
| 11 | Brass Pooja Thali                             | SHR-BRS-THL-06            | 73239420   |         5% |
| 12 | Shri Mahamrityunjay Maha Yantram – Copper     | SHR-YAN-MMR-001           | 74199990   |        18% |
| 13 | Brass Ganesha Idol                            | SHR-GI-BR-055-1P          | 74198030   |         5% |
| 14 | Kaal Sarp Yog Dosh Nivaran Yantra – Copper    | SHR-KSY-01                | 74199990   |        18% |
| 15 | Natural Sphatik Jaap Mala                     | SHR-SPM-108-78            | 71161000   |         3% |
| 16 | Kaal Sarp Yog Dosh Nivaran Yantra – Copper    | SHR-YAN-KSY-001           | 74199990   |        18% |
| 17 | Multi-Yantra Copper Plaque                    | SHR-YAN-MULTI-001         | 74199990   |        18% |
| 18 | Mahamrityunjay Yantra – Copper                | SHR-MMY-001               | 74199990   |        18% |
| 19 | Shri Mangal Yantra – Copper                   | SHR-YAN-MNG-001           | 74199990   |        18% |
| 20 | Multi Yantra Copper Plaque                    | SHR-YAN-MULTI-002         | 74199990   |        18% |
| 21 | Copper Ganesh Yantra 3×3 Inch                 | SHR-CGY-03IN-001          | 74198040   |        18% |
| 22 | Brass Peacock Pooja Thali                     | SHR-BRS-PTH-PK            | 73239420   |         5% |
| 23 | Wooden Pooja Chowki                           | SHR-WOD-CHW-001           | 44219119   |         5% |
| 24 | Sphatik Shivling                              | SHR-SPH-SHL-25            | 70189010   |         5% |
| 25 | Copper Lakshmi Yantra 3×3 Inch                | SHR-CLY-03IN-001          | 74198040   |        18% |
| 26 | Brass Trishul with Damru & Stand              | SHR-BR-TRI-DMR-10CM-001   | 74198030   |        18% |
| 27 | Copper Navgraha Yantra 3×3 Inch               | SHR-CNY-03IN-001          | 74198040   |        18% |
| 28 | Copper Saraswati Yantra 3×3 Inch              | SHR-CSY-03IN-001          | 74198040   |        18% |
| 29 | Copper Kuber Yantra 3×3 Inch                  | SHR-CKY-03IN-001          | 74198040   |         5% |
| 30 | Tulsi Mala                                    | SHR-TUL-MAL               | 71179090   |         3% |
| 31 | Brass Vastu Pyramid                           | SHR-BRS-PYR-3L            | 74199930   |         5% |
| 32 | Metal Dhoop Dani with Handle                  | SHR-DDM-H01-GD            | 73269099   |        18% |
| 33 | Copper Shani Yantra 3×3 Inch                  | SHR-CSHY-03IN-001         | 74198040   |        18% |
| 34 | Wooden Damaru                                 | SHR-WD-DMR-001            | 92060000   |        18% |
| 35 | Glass Shree Yantra Cone                       | SHR-SYC-GL-04-1P          | 70189010   |         5% |
| 36 | Pure Copper Panchpatra Udharini Set           | SHR-PCS-SH01-70           | 74181022   |         5% |
| 37 | Digital Tally Counter with Compass            | SHR-TC-COMP-WG-01         | 95062900   |         5% |
| 38 | Beads Wood Necklace                           | SHR-VJM-108-RD-36         | 71179090   |         3% |
| 39 | Brass Laddu Gopal Idol                        | SHR-LGI-BR-06-1P          | 74198030   |         5% |
| 40 | Panchmukhi Aarti Diya                         | SHR-BDIYA-001             | 69120090   |         5% |
| 41 | 5 Mukhi Rudraksha Jaap Mala                   | SHR-RDM-5M-108-GMB        | 71179090   |         3% |
| 42 | Natural Karungali Wooden Jaap Mala            | SHR-KGM-108-08            | 442199     |         5% |
| 43 | Square Wooden Chowki                          | SHR-WCH-SQ-L-01           | 44219119   |         5% |
| 44 | Pure Copper Pooja Thali 11"                   | SHR-CPT-006               | 74198090   |        18% |
| 45 | Brass Akhand Jyot Diya                        | SHR-AJ-004                | 74199930   |         5% |
| 46 | Brass Radha Krishna Idol                      | SHR-RKI-BR-03X02X03-1P    | 74198030   |         5% |
| 47 | Stainless Steel Pooja Box with 7 Containers   | SHR-POO-BOX               | 73239390   |         5% |
| 48 | Brass God Singhasan                           | SHR-GS-BR-07X05X09-1P     | 74198030   | 5%         |
| 49 | Glass Turtle Showpiece                        | SHR-GLS-TUR-15            | 70189010   |         5% |
| 50 | Brass Hand Bell 4 Inch                        | SHR-GHB-05IN-001          | 74199930   |         5% |
| 51 | Brass Pooja Kalash Lota                       | SHR-BRS-KLS-LTA           | 74181022   |         5% |
| 52 | Brass Garuda Head Bell                        | SHR-GB-05IN-001           | 74199930   |         5% |
| 53 | Brass Kamandal                                | SHR-BRS-KMD-105           | 74198030   |        18% |
| 54 | Bell Nandi-4                                  | SHR-BB-RND-03IN-001       | 74199930   |         5% |
| 55 | SHR-HK-11 (500 g)                             | SHR-HK-11-001             | 74199990   |        18% |
| 56 | Brass Pooja Bell 4 Inch                       | SHR-BB-N4-05IN-001        | 74199930   |         5% |
`;

const productsMap = {};

const lines = markdownTable.split('\n');
for (let i = 4; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || !line.includes('|')) continue;
  const columns = line.split('|').map(col => col.trim().replace(/\`/g, ''));
  if (columns.length >= 6) {
    const title = columns[2];
    const sku = columns[3];
    const hsn = columns[4];
    const taxStr = columns[5].replace('%', '').trim();
    let tax = parseInt(taxStr, 10);
    if (isNaN(tax)) { tax = 5; }
    
    if (sku) {
      productsMap[sku] = { title, hsn, tax };
    }
  }
}

fs.writeFileSync('e:\\Brand website\\backend\\data\\products_tax.json', JSON.stringify(productsMap, null, 2));
console.log('Successfully wrote products_tax.json');
