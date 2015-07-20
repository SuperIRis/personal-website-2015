module.exports = {
	"projects":[
		{
			"id":1,
			"name":"Batalla 300",
			"client":"Warner",
			"via":"Element",
			"type":"Sitio web",
			"tech":"nodejs + twitter api",
			"year":"2014",
			"importance":2,
			"images":{
				"home":"home-warner-batalla300.jpg",
				"thumb":"projects-warner-batalla300.jpg",
				"detail":[
					"projects-warner-batalla300-1.jpg",
					"projects-warner-batalla300-2.jpg",
					"projects-warner-batalla300-3.jpg"
				]
			},
			"video":"",
			"urls":["http://batalla300.element.com.mx"],
			"participation":"Desarrollo en NodeJS para backend e implementación Javascript del sitio.",
			"about":"La segunda parte de la película 300 estaba cerca de estrenarse en México y querían generar expectativa entre la comunidad. Dado que el argumento de la película se desarrollaba en batallas navales de griegos contra persas, se propuso un juego al estilo “battleship” a través de Twitter en contra del ejército persa (los “villanos” de la película).",			
			"technically":"El proyecto se desarrolló en NodeJS con MySQL y la API de Twitter. A través de ésta, se creaba un stream que monitoreaba en todo momento cualquier mención al hashtag #Batalla300 y la guardaba en base de datos. Un demonio corriendo cada 30 segundos descargaba todos los tweets nuevos y contestaba de acuerdo con el caso a través de literalmente un ejército de cuentas de soldados, capitanes, comandantes y demás militares persas. Cada turno lo iniciaba el usuario intentando hundir los barcos del enemigo dentro de un mapa variable (3x3 o 4x4 espacios según el nivel), en cierto número de tiros. De lograrlo, avanzaba al siguiente nivel y así sucesivamente hasta llegar con Artemisa, el personaje antagónico de la película.",
			"curious":"Originalmente no estábamos seguros de que la idea fuera realizable, en teoría lo era pero con APIs externas es difícil estar seguro hasta no hacer pruebas. Tuvimos que hacer varios ajustes debido a las políticas de Twitter y fue un gran riesgo dado que el tiempo estaba muy limitado y el tiempo de pruebas fue corto, pero resultó en un gran proyecto muy divertido de hacer, que generó casi 20,000 tweets de juego."
		},
		{
			"id":2,
			"name":"Rescate Xtreme",
			"client":"Speed Stick",
			"via":"Element",
			"type":"Juego HTML5",
			"tech":"html5 + javascript",
			"year":"2015",
			"importance":2,
			"images":{
				"home":"home-speedstick-rescatextreme.jpg",
				"thumb":"projects-speedstick-rescatextreme-1.jpg"
			},
			"video":"",
			"urls":["http://rescatextreme.com"],
			"participation":"Desarrollo del juego en Javascript con PhaserJS, maquetado y programación del sitio.",
			"about":"Speed Stick pretendía desarrollar un juego para atraer usuarios jóvenes a ",
			"technically":"Utilicé el framework de PhaserJS ",
			"curious":""
		},
		{
			"id":3,
			"name":"Mundo Inspireka",
			"client":"Sonrics",
			"via":"Element",
			"type":"Juego HTML5",
			"tech":"html5 + javascript",
			"year":"2015",
			"importance":1,
			"images":{
				"home":"home-sonrics-inspireka.jpg",
				"thumb":"projects-sonrics-inspireka.jpg",
				"detail":[
					"projects-sonrics-inspireka-1.jpg",
					"projects-sonrics-inspireka-2.jpg",
					"projects-sonrics-inspireka-3.jpg"
				]
			},
			"video":"https://www.youtube.com/embed/F88z4-s3FJE",
			"urls":["http://sonrics.com.mx/mundoinspireka"],
			"participation":"Desarrollo del juego en Javascript con PhaserJS. Creación de concepto y diseño de niveles.",
			"about":"El sitio de Sonrics alberga varios juegos con el tema de sus productos principales. Al convertirse Inspireka en una línea de varios dulces, surgió la necesidad de generar una nueva sección con su propio juego. El cliente deseaba que resaltáramos las cualidades de cada uno de los dulces, reforzando la idea de construcción y creación. La idea entonces se enfocó en utilizar cada dulce como un bloque de construcción con el cual Fink (la mascota de Inspireka), se abriera camino para atravesar los niveles.",
			"technically":"Utilicé el framework de PhaserJS y la herramienta de Tilemap para crear cada uno de los niveles, en base a un spritesheet.",
			"curious":"La parte más difícil fue el diseño de los niveles. Es el primer juego de niveles tipo puzzle que realizo y tenía que hacerlos de forma que fueran posibles de resolver, pero no demasiado obvios."
		},
		{
			"id":4,
			"name":"Minitoons",
			"client":"Metlife",
			"via":"Wunderman",
			"type":"Aplicación web",
			"tech":"html5 + javascript",
			"year":"2013",
			"importance":1,
			"images":{
				"thumb":"projects-metlife-minitoons.jpg",
				"detail":[
					"projects-metlife-minitoons-1.jpg",
					"projects-metlife-minitoons-2.jpg",
					"projects-metlife-minitoons-3.jpg",
					"projects-metlife-minitoons-4.jpg",
					"projects-metlife-minitoons-5.jpg",
				]
			},
			"video":"https://www.youtube.com/embed/G4__MYjhEJo",
			"urls":["https://www.minitoonsapp.com/"],
			"participation":"Desarrollo en PHP y Javascript (dentro de un equipo de trabajo).",
			"about":"Pretendíamos desarrollar una app para generar avatares al estilo de Peanuts. Esto con el objetivo de utilizarlas como foto de perfil y/o de portada, pudiendo escoger todos los aspectos incluyendo ropa, fondos, color de piel, cabello y rasgos faciales.",
			"technically":"Esta app está pensada para tres idiomas: inglés, español y portugués. Se cargaron los textos dinámicamente mediante PHP, junto con MySQL. El proceso de generar el avatar fue manejado con canvas y Javascript, con la ayuda de jQuery.",
			"curious":"El desarrollo se complicó muchísimo porque el cliente requirió soporte para IE8. Hubo que hacer un fallback en AS3 para compensar la falta de canvas en este browser, pero dadas las limitaciones para cierta longitud en base64, hubo que invertirle mucho más tiempo del esperado."
		},
		{
			"id":5,
			"name":"Sitio web",
			"client":"Sonrics",
			"via":"Element",
			"type":"Sitio web",
			"tech":"html5 + css + js",
			"year":"2012",
			"importance":1,
			"images":{

			},
			"video":"https://www.youtube.com/embed/YKi-4Tg6OPE",
			"urls":[],
			"participation":"Maquetado en HTML5 y CSS con efectos en Javascript.",
			"about":"",
			"technically":"",
			"curious":""
		},
		{
			"id":6,
			"name":"Mustang 50 años",
			"client":"Ford",
			"via":"Element",
			"type":"Aplicación web",
			"tech":"html5 + css + js",
			"year":"2014",
			"importance":1,
			"images":{

			},
			"video":"https://www.youtube.com/embed/nbuzxBZuElY",
			"urls":[],
			"participation":"",
			"about":"",
			"technically":"",
			"curious":""
		}

	]
}




