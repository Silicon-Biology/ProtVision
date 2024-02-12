document.getElementById("analyze").onclick = function() {
    let inputVal = document.getElementById("input").value.trim().toUpperCase();
    const fileInput = document.getElementById('fileInput').files[0];
    const resultElement = document.getElementById("output");
  
    if (inputVal !== '') {
        if (inputVal.startsWith('>')) {
            inputVal = inputVal.slice(1);
          // If the input starts with '>', combine substrings into one continuous sequence
          const sequences = inputVal.split('\n');
          const cleanedSequence = sequences.map(seq => seq.trim()).join('');
          processSequence(cleanedSequence,  resultElement);
          /* console.log("Sequence from manual entry:", cleanedSequence); // Logging the sequence */
        } else {
          // Treat it as a UniProt accession ID
          fetchUniProtSequence(inputVal)
            .then(sequence => {
              processSequence(sequence, resultElement);
             /*  console.log("Sequence from UniProt:", sequence); // Logging sequence from UniProt */
            })
            .catch(error => {
              resultElement.innerHTML = `Error: ${error.message}`;
            });
        }
      } else if (fileInput) {
        // If file uploaded, read its contents as sequence
        const reader = new FileReader();
        reader.onload = function(event) {
          const sequenceFromFile = event.target.result.replace(/\s/g, '').toUpperCase();
          processSequence(sequenceFromFile, "", resultElement);
          /* console.log("Sequence from File:", sequenceFromFile); // Logging sequence from file */
        };
        reader.onerror = function(event) {
          resultElement.innerHTML = "Error reading the file!";
        };
        reader.readAsText(fileInput);
      } else {
        resultElement.innerHTML = "Please provide a sequence or select a file!";
      }
    };


  function fetchUniProtSequence(accessionID) {
    const url = `https://rest.uniprot.org/uniprotkb/${accessionID}.fasta`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch sequence from UniProt.');
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        // Split data by lines, skip the first line (header), and join the rest to get the sequence
        const lines = data.split('\n');
        lines.shift(); // Remove the header
        const sequence = lines.join('').trim().toUpperCase(); // Extract and clean sequence
        if (sequence.length > 0) {
          return sequence;
        } else {
          throw new Error('No sequence found for this UniProt accession ID.');
        }
      });
  }
  
  
  function processSequence(data) {
    const protein = data.split('');
    const resultElement = document.getElementById("output");
    let c = 0, w = 0, y = 0;
  
   // Count occurrences of C, W, Y in the sequence
   for (let base of protein) {
    if (base === 'C') c++;
    else if (base === 'W') w++;
    else if (base === 'Y') y++;
}

/* since the presence of trptophan and tyrosine is a compulsory we are checking here the number of W and Y. If there are none we skip to show the error message. */

  if (w > 0 && y > 0) {
    const mw = {
      'A': 71.0788, 'R': 156.1875, 'N': 114.1038, 'D': 115.0886, 'C': 103.1388,
      'E': 129.115, 'Q': 128.1307, 'G': 57.0519, 'H': 137.1411, 'I': 113.1594,
      'L': 113.1594, 'K': 128.1741, 'M': 131.1926, 'F': 147.1766, 'P': 97.1167,
      'S': 87.0782, 'T': 101.1051, 'W': 186.2132, 'Y': 163.1760, 'V': 99.1326
    };

    let add = 0;
    for (let base of protein) {
/*         if (mw[base] === undefined){
            console.log("Unknown AA: ${base}");
        } */
      add += mw[base];
    }

    // Adding the molecular weight of water below.
    const mwprotein = add + 18.01524; 

    const ectyr = 1490;
    const ectrp = 5500;
    const eccys = 125;
    /* Here we start to calculate the exticntion coefficient */
    let ecprot;

    if (c % 2 === 0) {
      ecprot = y * ectyr + w * ectrp + (c / 2) * eccys;
    } else if (c % 2 !== 0) {
      ecprot = y * ectyr + w * ectrp + ((c - 1) / 2) * eccys;
    } else if (c <= 1) {
      ecprot = y * ectyr + w * ectrp;
    }
/* 
    console.log("Molecular Weight:", mwprotein);
    console.log("Extinction Coefficient:", ecprot);    These are for testing purposes */

    const absorbprot = ecprot / mwprotein;

    const resultMessage = `The Extinction Coefficient of Given Protein Sequence is: ${ecprot} and the Absorbance is: ${absorbprot}.`;
    
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
} else {
    resultElement.innerHTML = `As there are no Tryptophan (W) or Tyrosine (Y) in the given protein, it not visible to UV spectrometer`;
}
}
