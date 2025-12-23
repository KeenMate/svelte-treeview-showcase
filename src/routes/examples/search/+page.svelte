<script lang="ts">
	import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs';
	import { Tree } from '@keenmate/svelte-treeview';

	// Comprehensive movie database with genres, movies, directors, and actors
	const searchableData = [
		// Root: Movie Database
		{ id: '1', path: '1', name: '🎬 Movie Database', type: 'root', description: 'Complete movie collection' },

		// Main Categories
		{ id: '1.1', path: '1.1', name: '🎭 Genres', type: 'category', description: 'Movies organized by genre' },
		{ id: '1.2', path: '1.2', name: '🎥 Directors', type: 'category', description: 'Movies organized by director' },
		{ id: '1.3', path: '1.3', name: '⭐ Actors', type: 'category', description: 'Movies organized by actors' },

		// GENRES SECTION
		// Action Genre
		{ id: '1.1.1', path: '1.1.1', name: '💥 Action', type: 'genre', description: 'High-octane action films' },
		{ id: '1.1.1.1', path: '1.1.1.1', name: 'The Dark Knight (2008)', type: 'movie', description: 'Christopher Nolan, Christian Bale, Heath Ledger' },
		{ id: '1.1.1.2', path: '1.1.1.2', name: 'Mad Max: Fury Road (2015)', type: 'movie', description: 'George Miller, Tom Hardy, Charlize Theron' },
		{ id: '1.1.1.3', path: '1.1.1.3', name: 'Die Hard (1988)', type: 'movie', description: 'John McTiernan, Bruce Willis, Alan Rickman' },
		{ id: '1.1.1.4', path: '1.1.1.4', name: 'John Wick (2014)', type: 'movie', description: 'Chad Stahelski, Keanu Reeves, Michael Nyqvist' },
		{ id: '1.1.1.5', path: '1.1.1.5', name: 'The Matrix (1999)', type: 'movie', description: 'Wachowski Sisters, Keanu Reeves, Laurence Fishburne' },
		{ id: '1.1.1.6', path: '1.1.1.6', name: 'Terminator 2: Judgment Day (1991)', type: 'movie', description: 'James Cameron, Arnold Schwarzenegger, Linda Hamilton' },
		{ id: '1.1.1.7', path: '1.1.1.7', name: 'Raiders of the Lost Ark (1981)', type: 'movie', description: 'Steven Spielberg, Harrison Ford, Karen Allen' },

		// Drama Genre
		{ id: '1.1.2', path: '1.1.2', name: '🎭 Drama', type: 'genre', description: 'Emotional and character-driven stories' },
		{ id: '1.1.2.1', path: '1.1.2.1', name: 'The Shawshank Redemption (1994)', type: 'movie', description: 'Frank Darabont, Tim Robbins, Morgan Freeman' },
		{ id: '1.1.2.2', path: '1.1.2.2', name: 'Forrest Gump (1994)', type: 'movie', description: 'Robert Zemeckis, Tom Hanks, Robin Wright' },
		{ id: '1.1.2.3', path: '1.1.2.3', name: 'The Godfather (1972)', type: 'movie', description: 'Francis Ford Coppola, Marlon Brando, Al Pacino' },
		{ id: '1.1.2.4', path: '1.1.2.4', name: '12 Years a Slave (2013)', type: 'movie', description: 'Steve McQueen, Chiwetel Ejiofor, Michael Fassbender' },
		{ id: '1.1.2.5', path: '1.1.2.5', name: 'Schindler\'s List (1993)', type: 'movie', description: 'Steven Spielberg, Liam Neeson, Ralph Fiennes' },
		{ id: '1.1.2.6', path: '1.1.2.6', name: 'The Pianist (2002)', type: 'movie', description: 'Roman Polanski, Adrien Brody, Thomas Kretschmann' },
		{ id: '1.1.2.7', path: '1.1.2.7', name: 'Good Will Hunting (1997)', type: 'movie', description: 'Gus Van Sant, Matt Damon, Robin Williams' },
		{ id: '1.1.2.8', path: '1.1.2.8', name: 'A Beautiful Mind (2001)', type: 'movie', description: 'Ron Howard, Russell Crowe, Jennifer Connelly' },

		// Comedy Genre
		{ id: '1.1.3', path: '1.1.3', name: '😄 Comedy', type: 'genre', description: 'Hilarious and entertaining films' },
		{ id: '1.1.3.1', path: '1.1.3.1', name: 'The Grand Budapest Hotel (2014)', type: 'movie', description: 'Wes Anderson, Ralph Fiennes, F. Murray Abraham' },
		{ id: '1.1.3.2', path: '1.1.3.2', name: 'Superbad (2007)', type: 'movie', description: 'Greg Mottola, Jonah Hill, Michael Cera' },
		{ id: '1.1.3.3', path: '1.1.3.3', name: 'The Hangover (2009)', type: 'movie', description: 'Todd Phillips, Bradley Cooper, Ed Helms, Zach Galifianakis' },
		{ id: '1.1.3.4', path: '1.1.3.4', name: 'Borat (2006)', type: 'movie', description: 'Larry Charles, Sacha Baron Cohen, Ken Davitian' },
		{ id: '1.1.3.5', path: '1.1.3.5', name: 'Anchorman (2004)', type: 'movie', description: 'Adam McKay, Will Ferrell, Christina Applegate' },
		{ id: '1.1.3.6', path: '1.1.3.6', name: 'Bridesmaids (2011)', type: 'movie', description: 'Paul Feig, Kristen Wiig, Maya Rudolph' },
		{ id: '1.1.3.7', path: '1.1.3.7', name: 'Mrs. Doubtfire (1993)', type: 'movie', description: 'Chris Columbus, Robin Williams, Sally Field' },

		// Sci-Fi Genre
		{ id: '1.1.4', path: '1.1.4', name: '🚀 Sci-Fi', type: 'genre', description: 'Science fiction and futuristic tales' },
		{ id: '1.1.4.1', path: '1.1.4.1', name: 'Inception (2010)', type: 'movie', description: 'Christopher Nolan, Leonardo DiCaprio, Marion Cotillard' },
		{ id: '1.1.4.2', path: '1.1.4.2', name: 'Interstellar (2014)', type: 'movie', description: 'Christopher Nolan, Matthew McConaughey, Anne Hathaway' },
		{ id: '1.1.4.3', path: '1.1.4.3', name: 'Blade Runner 2049 (2017)', type: 'movie', description: 'Denis Villeneuve, Ryan Gosling, Harrison Ford' },
		{ id: '1.1.4.4', path: '1.1.4.4', name: 'Ex Machina (2014)', type: 'movie', description: 'Alex Garland, Alicia Vikander, Oscar Isaac' },
		{ id: '1.1.4.5', path: '1.1.4.5', name: 'Arrival (2016)', type: 'movie', description: 'Denis Villeneuve, Amy Adams, Jeremy Renner' },
		{ id: '1.1.4.6', path: '1.1.4.6', name: 'The Martian (2015)', type: 'movie', description: 'Ridley Scott, Matt Damon, Jessica Chastain' },
		{ id: '1.1.4.7', path: '1.1.4.7', name: 'Dune (2021)', type: 'movie', description: 'Denis Villeneuve, Timothée Chalamet, Zendaya' },
		{ id: '1.1.4.8', path: '1.1.4.8', name: 'Star Wars: A New Hope (1977)', type: 'movie', description: 'George Lucas, Mark Hamill, Harrison Ford, Carrie Fisher' },

		// Horror Genre
		{ id: '1.1.5', path: '1.1.5', name: '👻 Horror', type: 'genre', description: 'Scary and thrilling movies' },
		{ id: '1.1.5.1', path: '1.1.5.1', name: 'The Shining (1980)', type: 'movie', description: 'Stanley Kubrick, Jack Nicholson, Shelley Duvall' },
		{ id: '1.1.5.2', path: '1.1.5.2', name: 'Get Out (2017)', type: 'movie', description: 'Jordan Peele, Daniel Kaluuya, Allison Williams' },
		{ id: '1.1.5.3', path: '1.1.5.3', name: 'Hereditary (2018)', type: 'movie', description: 'Ari Aster, Toni Collette, Alex Wolff' },
		{ id: '1.1.5.4', path: '1.1.5.4', name: 'The Exorcist (1973)', type: 'movie', description: 'William Friedkin, Ellen Burstyn, Linda Blair' },
		{ id: '1.1.5.5', path: '1.1.5.5', name: 'It (2017)', type: 'movie', description: 'Andy Muschietti, Bill Skarsgård, Jaeden Martell' },
		{ id: '1.1.5.6', path: '1.1.5.6', name: 'The Conjuring (2013)', type: 'movie', description: 'James Wan, Vera Farmiga, Patrick Wilson' },

		// Thriller Genre
		{ id: '1.1.6', path: '1.1.6', name: '🔪 Thriller', type: 'genre', description: 'Suspenseful and intense films' },
		{ id: '1.1.6.1', path: '1.1.6.1', name: 'Se7en (1995)', type: 'movie', description: 'David Fincher, Brad Pitt, Morgan Freeman' },
		{ id: '1.1.6.2', path: '1.1.6.2', name: 'The Silence of the Lambs (1991)', type: 'movie', description: 'Jonathan Demme, Jodie Foster, Anthony Hopkins' },
		{ id: '1.1.6.3', path: '1.1.6.3', name: 'Zodiac (2007)', type: 'movie', description: 'David Fincher, Jake Gyllenhaal, Robert Downey Jr.' },
		{ id: '1.1.6.4', path: '1.1.6.4', name: 'Gone Girl (2014)', type: 'movie', description: 'David Fincher, Ben Affleck, Rosamund Pike' },
		{ id: '1.1.6.5', path: '1.1.6.5', name: 'Shutter Island (2010)', type: 'movie', description: 'Martin Scorsese, Leonardo DiCaprio, Mark Ruffalo' },
		{ id: '1.1.6.6', path: '1.1.6.6', name: 'The Sixth Sense (1999)', type: 'movie', description: 'M. Night Shyamalan, Bruce Willis, Haley Joel Osment' },

		// Romance Genre
		{ id: '1.1.7', path: '1.1.7', name: '💕 Romance', type: 'genre', description: 'Love stories and romantic tales' },
		{ id: '1.1.7.1', path: '1.1.7.1', name: 'Titanic (1997)', type: 'movie', description: 'James Cameron, Leonardo DiCaprio, Kate Winslet' },
		{ id: '1.1.7.2', path: '1.1.7.2', name: 'The Notebook (2004)', type: 'movie', description: 'Nick Cassavetes, Ryan Gosling, Rachel McAdams' },
		{ id: '1.1.7.3', path: '1.1.7.3', name: 'La La Land (2016)', type: 'movie', description: 'Damien Chazelle, Ryan Gosling, Emma Stone' },
		{ id: '1.1.7.4', path: '1.1.7.4', name: 'Eternal Sunshine of the Spotless Mind (2004)', type: 'movie', description: 'Michel Gondry, Jim Carrey, Kate Winslet' },
		{ id: '1.1.7.5', path: '1.1.7.5', name: 'Pride and Prejudice (2005)', type: 'movie', description: 'Joe Wright, Keira Knightley, Matthew Macfadyen' },

		// Animation Genre
		{ id: '1.1.8', path: '1.1.8', name: '🎨 Animation', type: 'genre', description: 'Animated features and family films' },
		{ id: '1.1.8.1', path: '1.1.8.1', name: 'Spirited Away (2001)', type: 'movie', description: 'Hayao Miyazaki, Studio Ghibli' },
		{ id: '1.1.8.2', path: '1.1.8.2', name: 'Toy Story (1995)', type: 'movie', description: 'John Lasseter, Pixar, Tom Hanks, Tim Allen' },
		{ id: '1.1.8.3', path: '1.1.8.3', name: 'The Lion King (1994)', type: 'movie', description: 'Roger Allers, Rob Minkoff, Disney' },
		{ id: '1.1.8.4', path: '1.1.8.4', name: 'WALL-E (2008)', type: 'movie', description: 'Andrew Stanton, Pixar' },
		{ id: '1.1.8.5', path: '1.1.8.5', name: 'Inside Out (2015)', type: 'movie', description: 'Pete Docter, Pixar, Amy Poehler' },
		{ id: '1.1.8.6', path: '1.1.8.6', name: 'Coco (2017)', type: 'movie', description: 'Lee Unkrich, Pixar' },
		{ id: '1.1.8.7', path: '1.1.8.7', name: 'Spider-Man: Into the Spider-Verse (2018)', type: 'movie', description: 'Bob Persichetti, Sony Animation' },

		// DIRECTORS SECTION
		{ id: '1.2.1', path: '1.2.1', name: '🎬 Christopher Nolan', type: 'director', description: 'Master of mind-bending cinema' },
		{ id: '1.2.1.1', path: '1.2.1.1', name: 'Filmography', type: 'folder', description: 'Complete works' },
		{ id: '1.2.1.1.1', path: '1.2.1.1.1', name: 'Inception (2010)', type: 'movie', description: 'Leonardo DiCaprio, Marion Cotillard' },
		{ id: '1.2.1.1.2', path: '1.2.1.1.2', name: 'The Dark Knight (2008)', type: 'movie', description: 'Christian Bale, Heath Ledger' },
		{ id: '1.2.1.1.3', path: '1.2.1.1.3', name: 'Interstellar (2014)', type: 'movie', description: 'Matthew McConaughey, Anne Hathaway' },
		{ id: '1.2.1.1.4', path: '1.2.1.1.4', name: 'Dunkirk (2017)', type: 'movie', description: 'Tom Hardy, Mark Rylance' },
		{ id: '1.2.1.1.5', path: '1.2.1.1.5', name: 'Tenet (2020)', type: 'movie', description: 'John David Washington, Robert Pattinson' },
		{ id: '1.2.1.1.6', path: '1.2.1.1.6', name: 'Oppenheimer (2023)', type: 'movie', description: 'Cillian Murphy, Emily Blunt' },

		{ id: '1.2.2', path: '1.2.2', name: '🎬 Steven Spielberg', type: 'director', description: 'Hollywood legend' },
		{ id: '1.2.2.1', path: '1.2.2.1', name: 'Filmography', type: 'folder', description: 'Complete works' },
		{ id: '1.2.2.1.1', path: '1.2.2.1.1', name: 'Jaws (1975)', type: 'movie', description: 'Roy Scheider, Richard Dreyfuss' },
		{ id: '1.2.2.1.2', path: '1.2.2.1.2', name: 'E.T. (1982)', type: 'movie', description: 'Henry Thomas, Drew Barrymore' },
		{ id: '1.2.2.1.3', path: '1.2.2.1.3', name: 'Jurassic Park (1993)', type: 'movie', description: 'Sam Neill, Laura Dern' },
		{ id: '1.2.2.1.4', path: '1.2.2.1.4', name: 'Schindler\'s List (1993)', type: 'movie', description: 'Liam Neeson, Ralph Fiennes' },
		{ id: '1.2.2.1.5', path: '1.2.2.1.5', name: 'Saving Private Ryan (1998)', type: 'movie', description: 'Tom Hanks, Matt Damon' },

		{ id: '1.2.3', path: '1.2.3', name: '🎬 Quentin Tarantino', type: 'director', description: 'Master of dialogue and violence' },
		{ id: '1.2.3.1', path: '1.2.3.1', name: 'Filmography', type: 'folder', description: 'Complete works' },
		{ id: '1.2.3.1.1', path: '1.2.3.1.1', name: 'Pulp Fiction (1994)', type: 'movie', description: 'John Travolta, Samuel L. Jackson' },
		{ id: '1.2.3.1.2', path: '1.2.3.1.2', name: 'Kill Bill (2003)', type: 'movie', description: 'Uma Thurman, David Carradine' },
		{ id: '1.2.3.1.3', path: '1.2.3.1.3', name: 'Inglourious Basterds (2009)', type: 'movie', description: 'Brad Pitt, Christoph Waltz' },
		{ id: '1.2.3.1.4', path: '1.2.3.1.4', name: 'Django Unchained (2012)', type: 'movie', description: 'Jamie Foxx, Christoph Waltz' },
		{ id: '1.2.3.1.5', path: '1.2.3.1.5', name: 'Once Upon a Time in Hollywood (2019)', type: 'movie', description: 'Leonardo DiCaprio, Brad Pitt' },

		{ id: '1.2.4', path: '1.2.4', name: '🎬 Martin Scorsese', type: 'director', description: 'Master of crime dramas' },
		{ id: '1.2.4.1', path: '1.2.4.1', name: 'Filmography', type: 'folder', description: 'Complete works' },
		{ id: '1.2.4.1.1', path: '1.2.4.1.1', name: 'Taxi Driver (1976)', type: 'movie', description: 'Robert De Niro, Jodie Foster' },
		{ id: '1.2.4.1.2', path: '1.2.4.1.2', name: 'Goodfellas (1990)', type: 'movie', description: 'Ray Liotta, Robert De Niro' },
		{ id: '1.2.4.1.3', path: '1.2.4.1.3', name: 'The Departed (2006)', type: 'movie', description: 'Leonardo DiCaprio, Matt Damon' },
		{ id: '1.2.4.1.4', path: '1.2.4.1.4', name: 'The Wolf of Wall Street (2013)', type: 'movie', description: 'Leonardo DiCaprio, Jonah Hill' },

		{ id: '1.2.5', path: '1.2.5', name: '🎬 Denis Villeneuve', type: 'director', description: 'Visionary sci-fi director' },
		{ id: '1.2.5.1', path: '1.2.5.1', name: 'Filmography', type: 'folder', description: 'Complete works' },
		{ id: '1.2.5.1.1', path: '1.2.5.1.1', name: 'Arrival (2016)', type: 'movie', description: 'Amy Adams, Jeremy Renner' },
		{ id: '1.2.5.1.2', path: '1.2.5.1.2', name: 'Blade Runner 2049 (2017)', type: 'movie', description: 'Ryan Gosling, Harrison Ford' },
		{ id: '1.2.5.1.3', path: '1.2.5.1.3', name: 'Dune (2021)', type: 'movie', description: 'Timothée Chalamet, Zendaya' },

		// ACTORS SECTION
		{ id: '1.3.1', path: '1.3.1', name: '⭐ Leonardo DiCaprio', type: 'actor', description: 'Award-winning leading man' },
		{ id: '1.3.1.1', path: '1.3.1.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.1.1.1', path: '1.3.1.1.1', name: 'Titanic (1997)', type: 'movie', description: 'James Cameron, Kate Winslet' },
		{ id: '1.3.1.1.2', path: '1.3.1.1.2', name: 'Inception (2010)', type: 'movie', description: 'Christopher Nolan, Marion Cotillard' },
		{ id: '1.3.1.1.3', path: '1.3.1.1.3', name: 'The Wolf of Wall Street (2013)', type: 'movie', description: 'Martin Scorsese, Jonah Hill' },
		{ id: '1.3.1.1.4', path: '1.3.1.1.4', name: 'The Revenant (2015)', type: 'movie', description: 'Alejandro G. Iñárritu, Tom Hardy' },
		{ id: '1.3.1.1.5', path: '1.3.1.1.5', name: 'Once Upon a Time in Hollywood (2019)', type: 'movie', description: 'Quentin Tarantino, Brad Pitt' },

		{ id: '1.3.2', path: '1.3.2', name: '⭐ Tom Hanks', type: 'actor', description: "America's dad" },
		{ id: '1.3.2.1', path: '1.3.2.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.2.1.1', path: '1.3.2.1.1', name: 'Forrest Gump (1994)', type: 'movie', description: 'Robert Zemeckis, Robin Wright' },
		{ id: '1.3.2.1.2', path: '1.3.2.1.2', name: 'Cast Away (2000)', type: 'movie', description: 'Robert Zemeckis, Helen Hunt' },
		{ id: '1.3.2.1.3', path: '1.3.2.1.3', name: 'Saving Private Ryan (1998)', type: 'movie', description: 'Steven Spielberg, Matt Damon' },
		{ id: '1.3.2.1.4', path: '1.3.2.1.4', name: 'The Green Mile (1999)', type: 'movie', description: 'Frank Darabont, Michael Clarke Duncan' },

		{ id: '1.3.3', path: '1.3.3', name: '⭐ Meryl Streep', type: 'actor', description: 'The greatest actress of all time' },
		{ id: '1.3.3.1', path: '1.3.3.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.3.1.1', path: '1.3.3.1.1', name: 'The Devil Wears Prada (2006)', type: 'movie', description: 'David Frankel, Anne Hathaway' },
		{ id: '1.3.3.1.2', path: '1.3.3.1.2', name: 'Sophie\'s Choice (1982)', type: 'movie', description: 'Alan J. Pakula, Kevin Kline' },
		{ id: '1.3.3.1.3', path: '1.3.3.1.3', name: 'The Iron Lady (2011)', type: 'movie', description: 'Phyllida Lloyd, Jim Broadbent' },

		{ id: '1.3.4', path: '1.3.4', name: '⭐ Brad Pitt', type: 'actor', description: 'Hollywood icon' },
		{ id: '1.3.4.1', path: '1.3.4.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.4.1.1', path: '1.3.4.1.1', name: 'Fight Club (1999)', type: 'movie', description: 'David Fincher, Edward Norton' },
		{ id: '1.3.4.1.2', path: '1.3.4.1.2', name: 'Se7en (1995)', type: 'movie', description: 'David Fincher, Morgan Freeman' },
		{ id: '1.3.4.1.3', path: '1.3.4.1.3', name: 'Once Upon a Time in Hollywood (2019)', type: 'movie', description: 'Quentin Tarantino, Leonardo DiCaprio' },

		{ id: '1.3.5', path: '1.3.5', name: '⭐ Scarlett Johansson', type: 'actor', description: 'Action star and dramatic actress' },
		{ id: '1.3.5.1', path: '1.3.5.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.5.1.1', path: '1.3.5.1.1', name: 'Lost in Translation (2003)', type: 'movie', description: 'Sofia Coppola, Bill Murray' },
		{ id: '1.3.5.1.2', path: '1.3.5.1.2', name: 'Marriage Story (2019)', type: 'movie', description: 'Noah Baumbach, Adam Driver' },
		{ id: '1.3.5.1.3', path: '1.3.5.1.3', name: 'Black Widow (2021)', type: 'movie', description: 'Cate Shortland, Florence Pugh' },

		{ id: '1.3.6', path: '1.3.6', name: '⭐ Robert Downey Jr.', type: 'actor', description: 'Iron Man himself' },
		{ id: '1.3.6.1', path: '1.3.6.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.6.1.1', path: '1.3.6.1.1', name: 'Iron Man (2008)', type: 'movie', description: 'Jon Favreau, Gwyneth Paltrow' },
		{ id: '1.3.6.1.2', path: '1.3.6.1.2', name: 'Sherlock Holmes (2009)', type: 'movie', description: 'Guy Ritchie, Jude Law' },
		{ id: '1.3.6.1.3', path: '1.3.6.1.3', name: 'Zodiac (2007)', type: 'movie', description: 'David Fincher, Jake Gyllenhaal' },

		{ id: '1.3.7', path: '1.3.7', name: '⭐ Natalie Portman', type: 'actor', description: 'Oscar-winning actress' },
		{ id: '1.3.7.1', path: '1.3.7.1', name: 'Movies', type: 'folder', description: 'Filmography' },
		{ id: '1.3.7.1.1', path: '1.3.7.1.1', name: 'Black Swan (2010)', type: 'movie', description: 'Darren Aronofsky, Mila Kunis' },
		{ id: '1.3.7.1.2', path: '1.3.7.1.2', name: 'V for Vendetta (2005)', type: 'movie', description: 'James McTeigue, Hugo Weaving' },
		{ id: '1.3.7.1.3', path: '1.3.7.1.3', name: 'Jackie (2016)', type: 'movie', description: 'Pablo Larraín, Peter Sarsgaard' }
	];

	// Search configuration
	let searchText = $state('');
	let searchType = $state<'search' | 'filter'>('filter');
	let shouldUseInternalSearchIndex = $state(true);
	let searchValueMember = $state('name');
	let shouldDisplayDebugInformation = $state(false);
	let indexerBatchSize = $state(25);
	let indexerTimeout = $state(50);

	// Search navigation
	let treeElement: any = $state();
	let foundNodes: any[] = $state([]);
	let currentFoundIndex = $state(-1);

	// Custom search callback example
	let useCustomCallback = $state(false);
	const getSearchValueCallback = (node: any) => {
		return `${node.data.name} ${node.data.description} ${node.data.type}`.toLowerCase();
	};

	// Helper function to get level from path
	const getLevel = (path: string) => path.split('.').length;

	// Sort callback
	const sortCallback = (items: any[]) => {
		return items.sort((a, b) => {
			// First by level (depth in tree)
			const levelA = getLevel(a.path);
			const levelB = getLevel(b.path);
			if (levelA !== levelB) {
				return levelA - levelB;
			}

			// Then folders first, then files
			if (a.data.type !== b.data.type) {
				return a.data.type === 'folder' ? -1 : 1;
			}

			// Finally by name
			return a.data.name.localeCompare(b.data.name);
		});
	};

	// Demo search terms for movie database
	const sampleSearchTerms = [
		{ term: 'Nolan', description: 'Find Christopher Nolan movies' },
		{ term: 'DiCaprio', description: 'Find Leonardo DiCaprio films' },
		{ term: 'Sci-Fi', description: 'Find science fiction movies' },
		{ term: '2017', description: 'Find movies from 2017' },
		{ term: 'Pixar', description: 'Find Pixar animations' },
		{ term: 'Thriller', description: 'Find thriller movies' },
		{ term: 'Tom', description: 'Find Tom Hanks or Tom Hardy' }
	];

	// Apply sample search
	const applySampleSearch = (term: string) => {
		searchText = term;
		currentFoundIndex = -1;
	};

	// Handle search key events
	const handleSearchKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' && searchType === 'search' && foundNodes.length > 0) {
			// Cycle through found nodes
			if (currentFoundIndex + 1 >= foundNodes.length) {
				currentFoundIndex = -1;
			}
			scrollToIndex(currentFoundIndex + 1);
		} else if (event.key === 'Escape') {
			// Clear search on Escape
			searchText = '';
			currentFoundIndex = -1;
		}
	};

	// Scroll to found item
	const scrollToIndex = (index: number) => {
		if (index >= 0 && index < foundNodes.length && treeElement) {
			const node = foundNodes[index];
			treeElement.scrollToPath(node.path, {
				expand: true,
				highlight: true,
				scrollOptions: { behavior: 'smooth', block: 'center' }
			});
			currentFoundIndex = index;
		}
	};

	// Navigate found items
	const navigatePrevious = () => {
		if (currentFoundIndex > 0) {
			scrollToIndex(currentFoundIndex - 1);
		}
	};

	const navigateNext = () => {
		if (currentFoundIndex < foundNodes.length - 1) {
			scrollToIndex(currentFoundIndex + 1);
		}
	};

	// Update found nodes when search changes
	$effect(() => {
		if (searchText && treeElement) {
			// Use the tree's search method to get matching nodes
			foundNodes = treeElement.searchNodes ? treeElement.searchNodes(searchText, {
				suggest: true,
				threshold: 5,
				limit: 50
			}) : [];
			currentFoundIndex = -1;
		} else {
			foundNodes = [];
			currentFoundIndex = -1;
		}
	});
</script>

<DocLayout
	titleText="Search & Filter Examples"
	descriptionText="Explore async search indexing, filtering capabilities, and FlexSearch integration">

	<div class="py-1">
		<!-- Basic Search -->
		<ShowcaseSection
			titleText="SF01 Basic Search Functionality"
			subtitleText="Built-in search with FlexSearch integration"
			demoColumnTitle="Interactive Search"
			controlsColumnTitle="Search Controls"
			descriptionColumnTitle="Search Features">

			{#snippet demoContent()}
				<div class="tree-demo">
					<Tree
						bind:this={treeElement}
						treeId="search-basic-functionality"
						data={searchableData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						searchText={searchType === 'filter' ? searchText : ''}
						{shouldUseInternalSearchIndex}
						{searchValueMember}
						{shouldDisplayDebugInformation}
						{indexerBatchSize}
						{indexerTimeout}
						getSearchValueCallback={useCustomCallback ? getSearchValueCallback : undefined}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
						scrollHighlightClass="tree-highlight"
						scrollHighlightTimeout={2000}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">🔍 Search</label>
						<div class="input-group">
							<button
								class="btn btn-outline-secondary"
								type="button"
								onclick={() => searchType = searchType === 'filter' ? 'search' : 'filter'}
								title="Toggle between filter and search mode">
								{#if searchType === 'filter'}
									🔽
								{:else}
									🔎
								{/if}
							</button>
							<input
								type="text"
								class="form-control"
								placeholder={searchType === 'filter' ? 'Filter nodes...' : 'Search nodes...'}
								bind:value={searchText}
								onkeydown={handleSearchKeyDown}
							/>
							{#if searchText}
								<button
									class="btn btn-outline-secondary"
									type="button"
									onclick={() => { searchText = ''; currentFoundIndex = -1; }}
									title="Clear search">
									❌
								</button>
							{/if}
							{#if searchType === 'search' && foundNodes.length > 0}
								<button
									class="btn btn-outline-secondary"
									type="button"
									onclick={navigatePrevious}
									disabled={currentFoundIndex <= 0}
									title="Previous match">
									⬆️
								</button>
								<button
									class="btn btn-outline-secondary"
									type="button"
									onclick={navigateNext}
									disabled={currentFoundIndex >= foundNodes.length - 1}
									title="Next match">
									⬇️
								</button>
							{/if}
						</div>
						{#if searchText}
							<small class="text-muted d-block mt-1">
								{#if searchType === 'filter'}
									Found: {foundNodes.length || 0}
								{:else}
									Found: {foundNodes.length || 0}
									{#if foundNodes.length > 0 && currentFoundIndex >= 0}
										- Showing {currentFoundIndex + 1} of {foundNodes.length}
									{/if}
								{/if}
							</small>
						{/if}
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Search Mode</label>
						<div class="btn-group w-100" role="group">
							<button
								type="button"
								class="btn {searchType === 'filter' ? 'btn-primary' : 'btn-outline-primary'}"
								onclick={() => searchType = 'filter'}>
								<i class="fas fa-filter me-1"></i>🔽 Filter Mode
							</button>
							<button
								type="button"
								class="btn {searchType === 'search' ? 'btn-primary' : 'btn-outline-primary'}"
								onclick={() => searchType = 'search'}>
								<i class="fas fa-magnifying-glass me-1"></i>🔎 Search Mode
							</button>
						</div>
						<small class="text-muted d-block mt-2">
							{#if searchType === 'filter'}
								🔽 Filter mode: Shows only matching nodes
							{:else}
								🔎 Search mode: Highlights and navigates to matches
							{/if}
						</small>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Sample Searches</label>
						<div class="d-flex flex-wrap gap-2">
							{#each sampleSearchTerms as sample}
								<button
									type="button"
									class="btn btn-outline-primary btn-sm"
									onclick={() => applySampleSearch(sample.term)}
									title={sample.description}
								>
									{sample.term}
								</button>
							{/each}
						</div>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Search Value Member</label>
						<select class="form-select form-select-sm" bind:value={searchValueMember}>
							<option value="name">Name only</option>
							<option value="description">Description only</option>
						</select>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							bind:checked={shouldUseInternalSearchIndex}
							id="useIndex"
						/>
						<label class="form-check-label" for="useIndex">
							Use Internal Search Index
						</label>
					</div>

					<div class="form-check mb-3">
						<input
							class="form-check-input"
							type="checkbox"
							bind:checked={useCustomCallback}
							id="customCallback"
						/>
						<label class="form-check-label" for="customCallback">
							Use Custom Search Callback
						</label>
					</div>

					<div class="form-check">
						<input
							class="form-check-input"
							type="checkbox"
							bind:checked={shouldDisplayDebugInformation}
							id="debugInfo"
						/>
						<label class="form-check-label" for="debugInfo">
							Show Debug Information
						</label>
					</div>
				</div>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Search vs Filter</h4>
					<p>
						<strong>Filter Mode:</strong> Shows only matching nodes, hiding non-matches.
						Best for narrowing down large datasets.
					</p>
					<p>
						<strong>Search Mode:</strong> Shows all nodes but allows navigation between matches.
						Press Enter or use arrows to jump between results.
					</p>

					<h4>Keyboard Shortcuts</h4>
					<ul>
						<li><kbd>Enter</kbd> - Navigate to next match (search mode)</li>
						<li><kbd>↑</kbd> / <kbd>↓</kbd> - Navigate between matches</li>
						<li><kbd>Esc</kbd> - Clear search (when focused)</li>
					</ul>

					<h4>Performance Features</h4>
					<ul>
						<li>Async indexing with configurable batch size</li>
						<li>Debounced search queries</li>
						<li>Progressive result highlighting</li>
					</ul>

					<h4>FlexSearch Options</h4>
					<p>
						The <code>threshold</code> option (0-9) controls match strictness.
						Higher values require closer matches. Default is 0 (most fuzzy).
						This demo uses threshold=5 for balanced results.
					</p>

					<h4>Current Search</h4>
					<p class="tree-state">
						{searchText || 'No search active'}
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Advanced Search Configuration -->
		<ShowcaseSection
			titleText="SF02 Advanced Search Configuration"
			subtitleText="Fine-tune search performance and behavior"
			demoColumnTitle="Performance Settings"
			controlsColumnTitle="Indexer Configuration"
			descriptionColumnTitle="Performance Guidelines">

			{#snippet demoContent()}
				<div class="tree-controls">
					<div class="form-group mb-3">
						<label class="form-label">Indexer Batch Size: {indexerBatchSize}</label>
						<input
							type="range"
							class="form-range"
							bind:value={indexerBatchSize}
							min="1"
							max="100"
						/>
						<small class="text-muted">
							Number of items processed per batch during indexing
						</small>
					</div>

					<div class="form-group mb-3">
						<label class="form-label">Indexer Timeout: {indexerTimeout}ms</label>
						<input
							type="range"
							class="form-range"
							bind:value={indexerTimeout}
							min="10"
							max="500"
						/>
						<small class="text-muted">
							Delay between batches to prevent UI blocking
						</small>
					</div>

					<div class="alert alert-info">
						<h6 class="alert-heading">Configuration Impact</h6>
						<ul class="mb-0">
							<li><strong>Larger batch size:</strong> Faster indexing, potential UI freezing</li>
							<li><strong>Smaller batch size:</strong> Smoother UI, slower indexing</li>
							<li><strong>Higher timeout:</strong> More responsive UI during indexing</li>
							<li><strong>Lower timeout:</strong> Faster completion, possible UI lag</li>
						</ul>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`<Tree
  {data}
  idMember="id"
  pathMember="path"
  displayValueMember="name"
  searchText={searchQuery}
  shouldUseInternalSearchIndex={true}
  indexerBatchSize={25}
  indexerTimeout={50}
  shouldDisplayDebugInformation={false}
/>`}
					languageType="svelte"
					titleText="Performance Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Batch Size Guidelines</h4>
					<ul>
						<li><strong>Small datasets (&lt;100 items):</strong> 50-100</li>
						<li><strong>Medium datasets (100-1000 items):</strong> 25-50</li>
						<li><strong>Large datasets (&gt;1000 items):</strong> 10-25</li>
					</ul>

					<h4>Timeout Guidelines</h4>
					<ul>
						<li><strong>Fast devices:</strong> 10-25ms</li>
						<li><strong>Average devices:</strong> 25-75ms</li>
						<li><strong>Slow devices:</strong> 75-200ms</li>
					</ul>

					<h4>Debug Information</h4>
					<p>
						Enable debug mode to see indexing progress, search times,
						and result counts in the browser console.
					</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Custom Search Callback -->
		<ShowcaseSection
			titleText="SF03 Custom Search Callback"
			subtitleText="Define exactly what content should be searchable"
			demoColumnTitle="Custom Search Logic"
			controlsColumnTitle="Callback Implementation"
			descriptionColumnTitle="Use Cases">

			{#snippet demoContent()}
				<div class="tree-demo">
					<div class="tree-search mb-3">
						<input
							type="text"
							class="form-control"
							placeholder="Try searching: 'mobile', 'UI', 'PostgreSQL'..."
							bind:value={searchText}
						/>
					</div>
					<Tree
						treeId="search-custom-callback"
						data={searchableData}
						idMember="id"
						pathMember="path"
						displayValueMember="name"
						{searchText}
						shouldUseInternalSearchIndex={true}
						{getSearchValueCallback}
						{sortCallback}
						expandLevel={3}
						shouldToggleOnNodeClick={true}
					/>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`const getSearchValueCallback = (node) => {
  // Combine multiple fields for comprehensive search
  return [
    node.data.name,
    node.data.description,
    node.data.type
  ].join(' ').toLowerCase();
};

// Alternative: weighted search
const getWeightedSearchValue = (node) => {
  const name = node.data.name;
  const desc = node.data.description;

  // Name appears 3x for higher relevance
  return \`\${name} \${name} \${name} \${desc}\`.toLowerCase();
};`}
					languageType="javascript"
					titleText="Custom Search Callback"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h4>Callback Function</h4>
					<p>
						The callback receives a tree node and should return a string
						containing all searchable content for that node.
					</p>

					<h4>Common Patterns</h4>
					<ul>
						<li><strong>Multi-field search:</strong> Combine name, description, tags</li>
						<li><strong>Weighted fields:</strong> Repeat important fields for relevance</li>
						<li><strong>Normalized text:</strong> Convert to lowercase, remove special chars</li>
						<li><strong>Metadata search:</strong> Include hidden properties like IDs, types</li>
					</ul>

					<h4>Performance Tips</h4>
					<ul>
						<li>Keep callback function lightweight</li>
						<li>Pre-process text if possible</li>
						<li>Avoid complex string operations</li>
					</ul>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- Search Examples -->
		<div class="mt-5">
			<h2 class="mb-4">Search Examples & Patterns</h2>
			<div class="row g-4">
				<div class="col-lg-6">
					<h4>File System Search</h4>
					<CodeBlock
						codeContent={`// Search file names and extensions
const fileSearchCallback = (node) => {
  const name = node.data.name;
  const extension = name.split('.').pop() || '';
  const path = node.data.path;

  return \`\${name} \${extension} \${path}\`.toLowerCase();
};

// Usage: search "js", "component", "src/utils"`}
						languageType="javascript"
						titleText="File System Pattern"
					/>
				</div>
				<div class="col-lg-6">
					<h4>Organization Search</h4>
					<CodeBlock
						codeContent={`// Search employee data
const employeeSearchCallback = (node) => {
  const data = node.data;
  return [
    data.name,
    data.department,
    data.title,
    data.email,
    data.skills?.join(' ') || ''
  ].join(' ').toLowerCase();
};

// Usage: search department, title, or skills`}
						languageType="javascript"
						titleText="Employee Directory Pattern"
					/>
				</div>
			</div>
		</div>

		<!-- Next Steps -->
		<div class="mt-5">
			<h2 class="mb-4">Next Steps</h2>
			<div class="row g-4">
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">🔄</div>
							<h5>Drag & Drop</h5>
							<p>Interactive tree manipulation and reordering</p>
							<a href="/examples/drag-drop" class="btn btn-primary">Try Drag & Drop</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">⚡</div>
							<h5>Performance</h5>
							<p>Optimize for large datasets and virtualization</p>
							<a href="/examples/performance" class="btn btn-outline-primary">Performance Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card text-center h-100">
						<div class="card-body">
							<div class="display-6 mb-3">📝</div>
							<h5>Context Menus</h5>
							<p>Right-click actions and custom templates</p>
							<a href="/examples/context-menu" class="btn btn-outline-primary">Context Menus</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</DocLayout>

<style>
	.tree-demo {
		height: 400px;
		overflow: auto;
	}
</style>