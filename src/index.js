var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
  
  });


function contaLinhas(){
	const names = []
	const lineFiles = []

	//Pedido de entrada
	rl.question("Insira o caminho do dirétorio que deve ser analisado, Ex:/home/usuario/moenda/Moenda/doc \n", function(answer) {
		
		//Lendo todos os arquivos existenstes na pasta informada pelo usuário
		fs.readdirSync(answer).forEach(file => {
			names [names.length] = file;

			//lendo arquivos específicos
			fs.readFile(answer + '/' + file, 'utf-8', function(err, data){
			
				var lines = data.split("\n");
				var numberLines = lines.length;

				lineFiles.push(numberLines);
				
				console.log("\nNome: " + file + "\nNúmero de linhas: " + numberLines + "\n");

			})
		console.log(names);
		console.log(lineFiles);
		});

		rl.close();

	 });

}

contaLinhas();