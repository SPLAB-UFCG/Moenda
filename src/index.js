var fs = require('fs');



//analisa todos os arquivos em um diretorio e retorna a quantidade de linhas de cada um
function contaLinhas(){
	var readline = require('readline');
	var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout

	});

	var retorno = new Map();

	//Pedido de entrada
	rl.question("Insira o caminho do dirétorio que deve ser analisado, Ex:/home/usuario/moenda/Moenda/doc\n", function(answer) {
		
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

		//retorna um map() com chave = nome do arquivo e valor = quantidade de linhas.        
		console.log(retorno);

		rl.close();

	});
}


function coletaOitenta(link){
	var retorno = [];
				
		const fileTest = fs.statSync(link, "utf-8");

		if (fileTest.isFile()){
			const file = fs.readFileSync(link, "utf-8");

			const lines = file.split("\n");

			for(var i = 0; i<lines.length; i++){
				if (lines[i].trim().length > 80){
					retorno.push([i]+ " : " + lines[i]);
				}
			}
			
		}

	//retorna um map() com chave = número da linha e valor = linha.
	return retorno;

}
contaLinhas();
