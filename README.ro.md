# R.E.P.O Save Editor

[<img src="https://flagcdn.com/w20/us.png" alt="United States Flag"> Versiunea în Engleză](./README.md) | [<img src="https://flagcdn.com/w20/br.png" alt="Bandeira do Brasil"> Versão em Português](./README.pt.md)

<img src="src/app/icon.png" alt="Logo R.E.P.O Save Editor" width="200" height="200" />

## Prezentare Generală

R.E.P.O Save Editor este o aplicație web care vă permite să modificați fișierele de salvare ale jocului R.E.P.O. Acest instrument ajută jucătorii să ajusteze diverși parametri ai jocului, inclusiv:

- Statistici și atribute ale jucătorilor
- Statistici de run și monede
- Obiecte cumpărate și upgrade-uri
- Setări și configurații de echipă

**Încercați acum: [https://repo-save-editor.vercel.app](https://repo-save-editor.vercel.app)**

## Tehnologii

Acest proiect este construit folosind tehnologii web moderne:

- **Next.js 15** - Framework React cu App Router
- **React 19** - Biblioteca de UI
- **TypeScript** - JavaScript cu tipuri
- **TailwindCSS 4** - Framework CSS utilitar
- **next-intl** - Suport pentru internaționalizare
- **shadcn/ui** - Componente UI accesibile construite cu Radix UI
- **Lucide React** - Set de icoane frumoase și consistente

## Cum Să Începeți

```bash
# Clonați repository-ul
git clone https://github.com/MythicalLTD/repo-save-editor.git

# Navigați la directorul proiectului
cd repo-save-editor

# Instalați dependențele
pnpm install

# Porniți serverul de dezvoltare
pnpm run dev
```

Deschideți [http://localhost:3000](http://localhost:3000) în browser-ul dvs. pentru a accesa aplicația.

## Cum Să Folosiți

1. Localizați fișierul dvs. de salvare R.E.P.O (de obicei în `%USERPROFILE%\AppData\LocalLow\semiwork\Repo\saves`)
2. Încărcați fișierul de salvare în editor
3. Faceți modificările dorite
4. Descărcați fișierul de salvare modificat
5. Înlocuiți fișierul dvs. de salvare original cu cel modificat

## Construirea pentru Producție

```bash
# Creați o build optimizată pentru producție
pnpm run build

# Porniți serverul de producție
node .next/standalone/server.js
```

## Mulțumiri

Mulțumiri speciale pentru [R.E.P.O Save Editor de la N0edL](https://github.com/N0edL/R.E.P.O-Save-Editor) pentru furnizarea funcțiilor de criptare cu cheia în Python, care au fost extrase și implementate în Node.js pentru acest proiect.

## Autor

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/luccasfr">
          <img src="https://github.com/luccasfr.png?size=100" alt="Lucas Ferreira" />
          <p>Lucas Ferreira</p>
        </a>
      </td>
    </tr>
  </tbody>
</table>

