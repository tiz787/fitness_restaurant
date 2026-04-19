const fs = require('fs');
const tsxPath = 'src/components/admin/menuManagementTab/menuManagementTab.tsx';
let txt = fs.readFileSync(tsxPath, 'utf8');

const badPart = `        <p className="menuManagementTab__subtitle">{activeDishes.length} productos en el menu</p>
          onClick={handleOpenNewDishModal}
        >
          ➕ Nuevo plato
        </button>
      </div>`;

const goodPart = `        <p className="menuManagementTab__subtitle">{activeDishes.length} productos en el menu</p>
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
      </div>`;

txt = txt.replace(badPart, goodPart);
fs.writeFileSync(tsxPath, txt);
