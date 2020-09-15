
var fs = require('fs');
var readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
  
  });


function contaLinhas(){
	var retorno = new Map();

	//Pedido de entrada
	rl.question("Insira o caminho do dirétorio que deve ser analisado, Ex:/home/usuario/moenda/Moenda/doc \n", function(answer) {
		

		//Lendo todos os arquivos existenstes na pasta informada pelo usuário
		var arrayFiles = fs.readdirSync(answer)
		
		//lendo arquivos específicos e adicionando a quantidade de linhas a variável 'retorno'.
		for(var i = 0; i < arrayFiles.length; i++){
			
			const fileTest = fs.statSync(answer + "/" + arrayFiles[i], "utf-8");

			if (fileTest.isFile()){
				const file = fs.readFileSync(answer + "/" + arrayFiles[i], "utf-8");

				retorno.set(arrayFiles[i], file.split("\n").length);
			}
		};

		

	rl.close();

	console.log(retorno);

	//retorna um map() com chave = nome do arquivo e valor = quantidade de linhas.
	return retorno;
		


	});
}


function coletaOitenta(){
	var retorno = new Map();

	//Pedido de entrada
	rl.question("Insira o caminho do arquivo que deve ser analisado, Ex:/home/usuario/moenda/Moenda/doc.js \n", function(answer) {
		
		
		//lendo arquivos específicos e adicionando a quantidade de linhas a variável 'retorno'.
		
			
			const fileTest = fs.statSync(answer, "utf-8");

			if (fileTest.isFile()){
				const file = fs.readFileSync(answer, "utf-8");

				const lines = file.split("\n");

				for(var i = 0; i<lines.length; i++){
					if (lines[i].length > 80){
						retorno.set("Linha " + i, lines[i]);
					}
				}
				
			}


			console.log(retorno);
			


		

	rl.close();

	//retorna um map() com chave = número da linha e valor = linha.
	return retorno;
		


	});
}

