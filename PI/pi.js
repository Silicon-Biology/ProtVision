// Function to handle file input change event
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const resultElement = document.getElementById("output");
  
    reader.onload = function(event) {
      const sequenceFromFile = event.target.result.replace(/\s/g, '').toUpperCase();
      // Save the sequence from file to a variable
      window.fileSequence = sequenceFromFile;
    };
  
    reader.onerror = function(event) {
      resultElement.innerHTML = "Error reading the file!";
    };
  
    reader.readAsText(file);
  });
  
  // Function to handle "Analyze" button click
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
        processSequence(cleanedSequence, resultElement);
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
      // Process file sequence only when "Analyze" button is clicked
      if (window.fileSequence) {
        processSequence(window.fileSequence, resultElement);
      } else {
        resultElement.innerHTML = "Please select a file!";
      }
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
  
  function processSequence(data, resultElement) {
    // Sequence processing logic remains the same
    const data2 = data.toUpperCase();
    const protein = data2.split('');
    const totalLength = protein.length;
 
  
    let D = 0,
    E = 0,
    C = 0,
    Y = 0,
    H = 0,
    K = 0,
    R = 0;

    protein.forEach(amino => {
    switch (amino) {
        case 'D':
            D++;
            break;
        case 'E':
            E++;
            break;
        case 'C':
            C++;
            break;
        case 'Y':
            Y++;
            break;
        case 'H':
            H++;
            break;
        case 'K':
            K++;
            break;
        case 'R':
            R++;
            break;
        }
    });

    let ph = 0;
    let end = 0;

    while (end < 1) {
    let eqd = -D / (1 + Math.pow(10, 4.05 - ph));
    let eqe = -E / (1 + Math.pow(10, 4.45 - ph));
    let eqc = -C / (1 + Math.pow(10, 9.0 - ph));
    let eqy = -Y / (1 + Math.pow(10, 10.0 - ph));
    let eqh = H / (1 + Math.pow(10, ph - 5.98));
    let eqk = K / (1 + Math.pow(10, ph - 10.0));
    let eqr = R / (1 + Math.pow(10, ph - 12.0));
    let eqcooh = -1 / (1 + Math.pow(10, 3.55 - ph));
    let eqnh = 1 / (1 + Math.pow(10, ph - 7.5));
    let tpi = eqd + eqe + eqc + eqy + eqh + eqk + eqr + eqcooh + eqnh;

    if (tpi > 0) {
        ph += 0.01;
    } else {
        end++;
    }
}


      resultMessage = `Theoretical Pi of Protein is = ${ph}`;
      
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
  }
  
  

  