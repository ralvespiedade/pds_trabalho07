const readline = require('readline');

// Implementação do padrão Observer
class Observer {
  constructor() {
    this.observers = [];
  }

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fnToRemove) {
    this.observers = this.observers.filter(fn => fn !== fnToRemove);
  }

  fire() {
    this.observers.forEach(fn => {
      fn.call();
    });
  }
}

// Classe Editor
class Editor extends Observer {
  openFile() {
    console.log("Arquivo aberto");
    this.fire();
  }
}

// Subclasse TextEditor
class TextEditor extends Editor {
  constructor() {
    super();
    this.lines = [];
  }

  insertLine(lineNumber, text) {
    this.lines.splice(lineNumber - 1, 0, text);
    this.updateLineNumbers();
  }

  removeLine(lineNumber) {
    this.lines.splice(lineNumber - 1, 1);
    this.updateLineNumbers();
  }

  updateLineNumbers() {
    this.lines = this.lines.map((line, index) => `${index + 1}: ${line}`);
  }
}

// Função para interação com o usuário
function runTextEditor() {
  const textEditor = new TextEditor();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  textEditor.subscribe(() => {
    rl.question("Insira o texto (EOF para finalizar): ", (input) => {
      if (input !== "EOF") {
        textEditor.insertLine(textEditor.lines.length + 1, input);
        textEditor.fire();
      } else {
        textEditor.unsubscribe();
        rl.close();
      }
    });
  });

  textEditor.subscribe(() => {
    console.log("Salvando arquivo...");
    console.log("Conteúdo do arquivo:");
    console.log(textEditor.lines.join('\n'));
  });

  textEditor.openFile();
}

// Executar o editor de texto
runTextEditor();
