var голосовать = function( ваш_голос )
{
	// Для хранения рейтинга и остальных данных депутатов используется localStorage
	var депутаты = JSON.parse( localStorage.getItem( "депутаты" ) || "{}" )
	
	// В переменной deputiesData храняться голоса депутатов за текущий закнопроект и другие данные.
	deputiesData.forEach( function( депутат )
	{
		var ls_депутат = депутаты[ депутат.url ];

		// Восстанавливаем сохранённый рейтинг или устанавливаем 0
		депутат.рейтинг = ( !ls_депутат ) ? 0 : ls_депутат.рейтинг;
		
		// Восстанавливаем статистику
		депутат.статистика = ( !ls_депутат ) ? {} : ( ls_депутат.статистика || {} );
		
		// Копируем имя
		депутат.имя = депутат.sortName;
		
		// Сохраняем статистику голосов депутатов на будущее.
		if ( typeof variable === 'undefined' )
			депутат.статистика[ депутат.result ] = 1;
		else
			депутат.статистика[ депутат.result ] ++;

		// У каждого депутата есть ссылка с его ID на результаты его голосования.
		// Используем её как уникальный идентификатор.
		депутаты[ депутат.url ] = депутат;
		
		
		// Результат голосования каждого депутата лежит в переменной result
		// Соответствия взяты из функции renderer скрипта на странице с результатами голосования на vote.duma.gov.ru.
		// Значение -1 соответствует голосу "За"
		// Значение 0 соответствует голосу "Воздержался"
		// Значение 1 соответствует голосу "Против"
		// Значение 2 соответствует голосу "Не голосовал"
		
		// Меняем рейтинг депутата в соответствии с нашим выбором.
		депутат.рейтинг += ( депутат.result == ваш_голос ) ? 1 : -1;
	} )
	
	//Сохраняем рейтинг и другие данные в localStorage
	localStorage.setItem( "депутаты" , JSON.stringify( депутаты ) );
}

var за = function()
{
	// Значение -1 соответствует голосу "За"
	return голосовать( -1 );
}

var против = function()
{
	// Значение 1 соответствует голосу "Против"
	return голосовать( 1 );
}

var вывести_по_рейтингу = function( список )
{
	var список_по_рейтингу = [];
	
	for ( ключ in список )
		список_по_рейтингу.push( список[ ключ ] );
	
	список_по_рейтингу.sort( function( первый, второй )
	{
		// Сортируем в порядке убывания рейтинга
		return второй.рейтинг - первый.рейтинг;
	} )
	
	список_по_рейтингу.forEach( function( элемент )
	{
		// Выводим результаты в консоль
		console.log( элемент.имя + ": " + элемент.рейтинг + ( элемент.количество ? "(" + элемент.количество + ")" : "" ) );
	} )
	
}

var рейтинг_депутатов = function()
{
	var депутаты = JSON.parse( localStorage.getItem( "депутаты" ) || "{}" );
	
	вывести_по_рейтингу( депутаты );
}

var рейтинг_партий = function()
{
	var депутаты = JSON.parse( localStorage.getItem( "депутаты" ) || "{}" );
	var партии = {};
	
	for ( идентификатор in депутаты )
	{
		var депутат = депутаты[ идентификатор ];
		var партия = партии[ депутат.factionCode ];
		if ( партия )
		{
			// Рейтинг партии складывается из рейтинга депутатов.
			партия.рейтинг += депутат.рейтинг;
			партия.количество ++;
		}
		else
			партии[ депутат.factionCode ] = { имя: депутат.faction , рейтинг: депутат.рейтинг , количество: 1 };
	}
	
	вывести_по_рейтингу( партии );
}

console.log( "за() - проголосовать за\n\
против() - проголосовать против\n\
рейтинг_депутатов() - выводит текущий рейтинг депутатов в соответствии с вашими голосами\n\
рейтинг_партий() - выводит текущий рейтинг партий в соответствии с вашими голосами\n\
" )