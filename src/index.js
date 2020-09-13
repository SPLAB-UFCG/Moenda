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

			const file = fs.readFileSync(answer + "/" + arrayFiles[i], "utf-8");

			retorno.set(arrayFiles[i], file.split("\n").length);

		};

		rl.close();
		
		//retorna um map() com chave = nome do arquivo e valor = quantidade de linhas.
		return retorno;

	});
}


