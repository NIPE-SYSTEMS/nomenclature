var fuzzyItems = [
{
	text: "C",
	displayed: false,
	score: 0,
	highlightedCharacters: []
},
{
	text: "Carboxyl-Gruppe",
	displayed: false,
	score: 0,
	highlightedCharacters: []
},
{
	text: "Calcium",
	displayed: false,
	score: 0,
	highlightedCharacters: []
}
];

function fuzzyGenerateHtml()
{
	var markup = "<ul>";
	
	// sort by score
	fuzzyItems.sort(function(a, b)
	{
		return a.score - b.score;
	});
	
	// render matches
	fuzzyItems.forEach(function(value, key, array)
	{
		if(value.displayed)
		{
			markup += "<li>";
			
			value.text.split("").forEach(function(innerValue, innerKey, innerArray)
			{
				if(value.highlightedCharacters.indexOf(innerKey) != -1)
				{
					markup += "<span>" + innerValue + "</span>";
				}
				else
				{
					markup += innerValue;
				}
			});
			
			markup += " (score: " + value.score + ")</li>";
		}
	});
	
	markup += "</ul>";
	
	// output matches
	document.getElementById("matches").innerHTML = markup;
}

function fuzzySearch(searchTerm)
{
	fuzzyItems.forEach(function(value, key, array)
	{
		var firstFound = value.text.indexOf(searchTerm[0]);
		var nextStart = 0;
		var lastFound = 0;
		
		value.highlightedCharacters = [];
		value.score = 0;
		value.displayed = true;
		
		searchTerm.split("").forEach(function(searchTermChar, searchTermKey, searchTermArray)
		{
			nextStart = value.text.indexOf(searchTermChar, nextStart);
			if(nextStart == -1)
			{
				value.displayed = false; // hide item
				return;
			}
			value.score += nextStart - lastFound; // increase score
			value.highlightedCharacters.push(nextStart); // highlight found character
			lastFound = nextStart;
			nextStart++; // move to next character
		});
		
		value.score += value.text.length - lastFound - 1;
	});
}

function search(e)
{
	if(!e)
	{
		return;
	}
	
	fuzzySearch(e.target.value);
	fuzzyGenerateHtml();
}

window.onload = function()
{
	document.getElementById("search").onkeypress = search;
	document.getElementById("search").onkeyup = search;
	
	fuzzySearch("");
	fuzzyGenerateHtml();
};