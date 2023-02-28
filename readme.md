# Inarow

__For å teste med mer enn 5 brukere må man åpne en annen nettleser (f.eks firefox eller edge)__

## installasjon av Node.js
1. last ned Node.js fra https://nodejs.org/en/
2. kjør node -version i cmd (--version i terminal)
3. last ned Node.js exec vscode extension
4. åpne cmd og kjør npm install express --save
4. kjør app.js ved å trykke f8, og avslutt med f9

</br>

### To do:
* ~~sende data fra spiller til server (bare oppdateringer)~~
* server oppdaterer spillere på hvert move (nesten ferdig)
* oversette gamestring fra array til string og tilbake
* ~~separere brukere~~ og holde styr på hvem sin tur det er.
* sørge for at to brukere med samme id ikke kan eksistere
* lage metode for å beholde navn serverid med localstorage (eller session)
* oppdatere hvor mange spillere som er med, og hvor mange som venter på å bli med. Slags køsystem
* ~~backend server. node.js~~
* ~~chat, lett å lage etter vanlig gameupdate~~
* lage egene spillrom, hvor man kan endre innstillinger
* ~~innlogging og lagre passord i database ~~
* spar plass ved uglify og beautify (burde lagre originalfilene et sted) https://beautifier.io/ og https://skalman.github.io/UglifyJS-online/


Elo: 
* Ea = 1/(1+(10**((Rb-Ra)/400)))
    * R er rating
    * E er forventet utfall
* Ra = Ra+K(Sa - Ea)
    * R er rating
    * K er en kostant som kontrollerer hvor sensitiv ratingen blir
    * E er forventet utfall
    * Sa er det faktiske utfallet