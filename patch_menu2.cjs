const fs = require('fs');
const tsxPath = 'src/components/admin/menuManagementTab/menuManagementTab.tsx';
let txt = fs.readFileSync(tsxPath, 'utf8');

const badPart = `      <header className="menuManagementTab__header">
        <h2 className="menuManagementTab__title">Gestion de menu</h2>
        <p className="menuManagementTab__subtitle">{activeDishes.length} productos en el menu</p>

        <div className="menuManagementTab__categories" aria-label="Filtro por categoria">`;

const goodPart = `      <header className="menuManagementTab__header">
        <h2 className="menuManagementTab__title">Gestion de menu</h2>
        <p className="menuManagementTab__subtitle">{activeDishes.length} productos en el menu</p>
      </header>

      <div className="menuManagementTab__toolbar">
        <label className="menuManagementTab__search" htmlFor="menu-search-input">
          <span aria-hidden>🔎</span>
          <input
            id="menu-search-input"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar platos..."
          />
        </label>

        <button
          type="button"
          className="menuManagementTab__newDishButton"
          onClick={handleOpenNewDishModal}
        >
          ➕ Nuevo plato
        </button>
      </div>

      <div className="menuManagementTab__categories" aria-label="Filtro por categoria">`;

txt = txt.replace(badPart, goodPart);
fs.writeFileSync(tsxPath, txt);
