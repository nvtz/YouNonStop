export default function randomSearchQuery() {
    var artists = ['Katty Perry', 'Eminem', 'Miley Cyrus', 'Imagine Dragons', 'Drake', 'Lorde', 'Lady Gaga', 'Avicii', 'John Newman', 'Big Sean',
        'Luke Bryan', 'Jay-Z', 'Robin Thicke', 'One Direction', 'Florida Georgia Line', 'Justin Timberlake', 'Macklemore', 'OneRepublic',
        'Capital Cities', 'Zedd', 'Passenger', 'Bruno Mars', 'Sage the Gemini', 'AWOLNATION', 'Lana Del Rey', 'Sara Bareilles',
        'The Neighbourhood', 'Mike WiLL Made It', 'Pitbull', 'Selena Gomez', 'Jason Aldean', 'Bastille', 'Ellie Goulding', 'P!nk',
        'Blake Shelton', 'Taylor Swift', 'A Great Big World', 'Beyonce', 'Paramore', 'Thomas Rhett', 'J. Cole', 'Daft Punk',
        'Jason Derulo', 'Anna Kendrick', 'Macklemore & Ryan Lewis', 'Keith Urban', 'David Nail', 'Sevyn Streeter', 'Maroon 5', 'Eli Young Band',
        'Justin Bieber', 'Ylvis', 'Tim McGraw', 'Cassadee Pope', 'Kid Ink', 'Parmalee', 'Jason Derulo', 'Zendaya', 'Linkin Park',
        'Chris Young', 'Joe Nichols', 'Calvin Harris', 'Rich Homie Quan', 'Cole Swindell', 'Demi Lovato', 'Ariana Grande', 'Rihanna',
        'Martin Garrix', 'Jon Henry Odgers', 'Idina Menzel', 'John Legend', 'Britney Spears', 'American Authors', 'Phillip Phillips', 'Tyler Farr',
        'B.o.B', 'August Alsina', 'The Band Perry', 'Lady Antebellum', 'Future', 'Eric Paslay',
        'Kristen Bell', 'Kristen Bell', 'Lee Brice', 'Zac Brown Band', 'Keith Urban And Miranda Lambert', 'YG', 'Randy Houser',
        'Brett Eldredge', 'Robin Thicke Featuring T.I. + Pharrell', 'Chris Brown Featuring Nicki Minaj', 'Aloe Blacc', 'DJ Snake', 'Darius Rucker',
        'Justin Moore', 'Hunter Hayes', 'Pharrell Williams', 'Easton Corbin', 'Jon Pardi'];

    /* All time artists
    var allTime = [ 'Elvis Presley', 'Garth Brooks', 'Led Zeppelin', 'Eagles', 'Billy Joel', 'Michael Jackson', 'Pink Floyd', 'Elton John', 
                    'Barbra Streisand', 'AC DC','George Strait', 'Aerosmith', 'The Rolling', 'Bruce Springsteen', 'Madonna', 'Mariah Carey', 
                    'Metallica', 'Whitney Houston', 'Van Halen', 'U2', 'Kenny Rogers', 'Celine Dion', 'Fleetwood Mac', 'Neil Diamond', 
                    'Shania Twain', 'Kenny G', 'Journey', 'Alabama', 'Guns N', 'Santana Mexico', 'Bob Seger', 'Alan Jackson', 
                    'Eric Clapton', 'Reba McEntire', 'Prince', 'Chicago', 'Simon and', 'Pac', 'Rod Stewart', 'Foreigner', 
                    'Bob Dylan', 'Backstreet Boys', 'Tim McGraw', 'Def Leppard', 'Willie Nelson', 'Eminem', 'Queen', 'Britney Spears', 
                    'Bon Jovi', 'Phil Collins', 'R. Kelly','Dave Matthews', 'James Taylor', 'John Denver', 'The Doors', 'Pearl Jam', 
                    'Boston', 'Dixie Chicks', 'Linda Ronstadt', 'Tom Petty', 'Jay Z', 'Ozzy Osbourne', 'Mannheim Steamroller', 'Tom Petty',
                    'Michael Bolton', 'Lynyrd Skynyrd', 'John Mellencamp', 'Brooks ', 'Barry Manilow', 'Boyz II', 'Frank Sinatra', 'Enya  Ireland', 
                    'Bee Gees', 'Janet Jackson', 'Creedence Clearwater', 'Faith Hill', 'Kenny Chesney', 'Rush  Canada', 'Nirvana', 'ZZ Top', 
                    'Luther Vandross', 'Creed', 'The Carpenters', 'Steve Miller', 'Toby Keith', 'Vince Gill', 'Green Day', 'Motley Crue',
                    'Earth', 'The Cars', 'Kid Rock', 'Sade', 'Jimmy Buffett', 'Lionel Richie', 'Red Hot', 'The Police', 
                    'Jimi Hendrix', 'Usher', 'Heart', 'The Beach', 'Linkin Park', 'Pink Floyd', 'The Beatles', 'Shakira',
                    'Jay Z', 'Ketty Perry', 'Eminem', 'Lady Gaga', 'Akon', 'Britney Spears', 'Justin Beiber',
                    'Justin Timberlake', 'Black Eyed Peas', 'Drake', 'Taylor Swift', 'Bon Jovi']; */

    var index = Math.floor(Math.random() * artists.length);
    return artists[index];
};
