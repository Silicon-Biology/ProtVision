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
    const values = {
      'W': { 'W': 1.0, 'C': 1.0, 'M': 24.68, 'H': 24.68, 'Y': 1.0, 'F': 1.0, 'Q': 1.0, 'N': 13.34, 'I': 1.0, 'R': 1.0, 'D': 1.0, 'P': 1.0, 'T': -14.03, 'K': 1.0, 'E': 1.0, 'V': -7.49, 'S': 1.0, 'G': -9.37, 'A': -14.03, 'L': 13.34 },

      'C': { 'W': 24.68, 'C': 1.0, 'M': 33.6, 'H': 33.6, 'Y': 1.0, 'F': 1.0, 'Q': -6.54, 'N': 1.0, 'I': 1.0, 'R': 1.0, 'D': 20.26, 'P': 20.26, 'T': 33.6, 'K': 1.0, 'E': 1.0, 'V': -6.54, 'S': 1.0, 'G': 1.0, 'A': 1.0, 'L': 20.26 },

      'M': {'W':1.0,'C':1.0,'M':-1.88,'H':58.28,'Y':24.68,'F':1.0,'Q':-6.54,'N':1.0,'I':1.0,'R':-6.54,'D':1.0,'P':44.94,'T':-1.88,'K':1.0,'E':1.0,'V':1.0,'S':44.94,'G':1.0,'A':13.34,'L':1.0},

      'H': {'W':-1.88,'C':1.0,'M':1.0,'H':1.0,'Y':44.94,'F':-9.37,'Q':1.0,'N':24.68,'I':44.94,'R':1.0,'D':1.0,'P':-1.88,'T':-6.54,'K':24.68,'E':1.0,'V':1.0,'S':1.0,'G':-9.37,'A':1.0,'L':1.0},

      'Y':{'W':-9.37,'C':1.0,'M':44.94,'H':13.34,'Y':13.34,'F':1.0,'Q':1.0,'N':1.0,'I':1.0,'R':-15.91,'D':24.68,'P':13.34,'T':-7.49,'K':1.0,'E':-6.54,'V':1.0,'S':1.0,'G':-7.49,'A':24.68,'L':1.0},

      'F':{'W':1.0,'C':1.0,'M':1.0,'H':1.0,'Y':33.6,'F':1.0,'Q':1.0,'N':1.0,'I':1.0,'R':1.0,'D':13.34,'P':20.26,'T':1.0,'K':-14.03,'E':1.0,'V':1.0,'S':1.0,'G':1.0,'A':1.0,'L':1.0},

      'Q':{'W':1.0,'C':-6.54,'M':1.0,'H':1.0,'Y':-6.54,'F':-6.54,'Q':20.26,'N':1.0,'I':1.0,'R':1.0,'D':20.26,'P':20.26,'T':1.0,'K':1.0,'E':20.26,'V':-6.54,'S':44.94,'G':1.0,'A':1.0,'L':1.0},

      'N':{'W':-9.37,'C':-1.88,'M':1.0,'H':1.0,'Y':1.0,'F':-14.03,'Q':-6.54,'N':1.0,'I':44.94,'R':1.0,'D':1.0,'P':-1.88,'T':-7.49,'K':24.68,'E':1.0,'V':1.0,'S':1.0,'G':-14.03,'A':1.0,'L':1.0},

      'I':{'W':1.0,'C':1.0,'M':1.0,'H':13.34,'Y':1.0,'F':1.0,'Q':1.0,'N':1.0,'I':1.0,'R':1.0,'D':1.0,'P':-1.88,'T':1.0,'K':-7.49,'E':44.94,'V':-7.49,'S':1.0,'G':1.0,'A':1.0,'L':20.26},

      'R':{'W':58.28,'C':1.0,'M':1.0,'H':20.26,'Y':-6.54,'F':1.0,'Q':20.26,'N':13.34,'I':1.0,'R':58.28,'D':1.0,'P':20.26,'T':1.0,'K':1.0,'E':1.0,'V':1.0,'S':44.94,'G':-7.49,'A':1.0,'L':1.0},

      'D':{'W':1.0,'C':1.0,'M':1.0,'H':1.0,'Y':1.0,'F':-6.54,'Q':1.0,'N':1.0,'I':1.0,'R':-6.54,'D':1.0,'P':1.0,'T':-14.03,'K':-7.49,'E':1.0,'V':1.0,'S':20.26,'G':1.0,'A':1.0,'L':1.0},

      'P':{'W':-1.88,'C':-6.54,'M':-6.54,'H':1.0,'Y':1.0,'F':20.26,'Q':20.26,'N':1.0,'I':1.0,'R':-6.54,'D':-6.54,'P':20.26,'T':1.0,'K':1.0,'E':18.38,'V':20.26,'S':20.26,'G':1.0,'A':20.26,'L':1.0},

      'T':{'W':-14.03,'C':1.0,'M':1.0,'H':1.0,'Y':1.0,'F':13.34,'Q':-6.54,'N':-14.03,'I':1.0,'R':1.0,'D':1.0,'P':1.0,'T':1.0,'K':1.0,'E':20.26,'V':1.0,'S':1.0,'G':-7.49,'A':1.0,'L':1.0},

      'K':{'W':1.0,'C':1.0,'M':33.6,'H':1.0,'Y':1.0,'F':1.0,'Q':24.68,'N':1.0,'I':-7.49,'R':33.6,'D':1.0,'P':-6.54,'T':1.0,'K':1.0,'E':1.0,'V':-7.49,'S':1.0,'G':-7.49,'A':1.0,'L':-7.49},

      'E':{'W':-14.03,'C':44.94,'M':1.0,'H':-6.54,'Y':1.0,'F':1.0,'Q':20.26,'N':1.0,'I':20.26,'R':1.0,'D':20.26,'P':20.26,'T':1.0,'K':1.0,'E':33.6,'V':1.0,'S':20.26,'G':1.0,'A':1.0,'L':1.0},

      'V':{'W':1.0,'C':1.0,'M':1.0,'H':1.0,'Y':-6.54,'F':1.0,'Q':1.0,'N':1.0,'I':1.0,'R':1.0,'D':-14.03,'P':20.26,'T':-7.49,'K':-1.88,'E':1.0,'V':1.0,'S':1.0,'G':-7.49,'A':1.0,'L':1.0},

      'S':{'W':1.0,'C':33.6,'M':1.0,'H':1.0,'Y':1.0,'F':1.0,'Q':20.26,'N':1.0,'I':1.0,'R':20.26,'D':1.0,'P':44.94,'T':1.0,'K':1.0,'E':20.26,'V':1.0,'S':20.26,'G':1.0,'A':1.0,'L':1.0},

      'G':{'W':13.34,'C':1.0,'M':1.0,'H':1.0,'Y':-7.49,'F':1.0,'Q':1.0,'N':-7.49,'I':-7.49,'R':1.0,'D':1.0,'P':1.0,'T':-7.49,'K':-7.49,'E':-6.54,'V':1.0,'S':1.0,'G':13.34,'A':-7.49,'L':1.0},

      'A':{'W':1.0,'C':44.94,'M':1.0,'H':-7.49,'Y':1.0,'F':1.0,'Q':1.0,'N':1.0,'I':1.0, 'R':1.0,'D':-7.49,'P':20.26,'T':1.0,'K':1.0,'E':1.0,'V':1.0,'S':1.0,'G':1.0,'A':1.0,'L':1.0},

      'L':{'W':24.68,'C':1.0,'M':1.0,'H':1.0,'Y':1.0,'F':1.0,'Q':33.6,'N':1.0,'I':1.0,'R':20.26,'D':1.0,'P':20.26,'T':1.0,'K':-7.49,'E':1.0,'V':1.0,'S':1.0,'G':1.0,'A':1.0,'L':1.0}
      // ... other values for different amino acids
    };
   


    const out = [];
for (let i = 0; i < totalLength; i++) {
  const current = protein[i];
  if (current === 'W' || current === 'C' || current === 'M' || current === 'H' || current === 'Y' || current === 'F' || current === 'Q' || current === 'N' || current === 'I' || current === 'R' || current === 'D' || current === 'P' || current === 'T' || current === 'K' || current === 'E' || current === 'V' || current === 'S' || current === 'G' || current === 'A' || current === 'L') {
    const aminoAcid = values[current];
    const nextAminoAcid = values[protein[i + 1]];
    if (aminoAcid && nextAminoAcid) {
      out[i] = aminoAcid[nextAminoAcid];
    }
  }
}

let sum = 0;
out.forEach((value) => {
  if (value !== undefined) {
    sum += value;
  }
});

const instabilityIndex = (10 / totalLength) * sum;
resultMessage = `The Instability Index was Found to be: ${instabilityIndex} \n `;
if (instabilityIndex < 40) {
  resultMessage += `The protein is stable!`;
} else {
  resultMessage += `The protein is unstable!!`;
}

    
    // Prepare and display the result message
    // let resultMessage = 'Estimated Half Life of Protein in Mammal = ' + `${halflifeM[protein[0]]}` + '\n'+ 'Estimated Half Life of Protein in Yeast = ' + `${halflifeY[protein[0]]}` + '\n' + 'Estimated Half Life of Protein in E.Coli = ' + `${halflifeE[protein[0]]}` + '\n ';
   
  
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
  }
  
  
    
    
  