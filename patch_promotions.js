const fs = require('fs');

const tsxPath = 'src/components/admin/promotionsManagementTab/promotionsManagementTab.tsx';
let txt = fs.readFileSync(tsxPath, 'utf8');

// Replace isCreateFormVisible with new states
txt = txt.replace(
  'const [isCreateFormVisible, setIsCreateFormVisible] = useState<boolean>(false)',
  `const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<PromotionCoupon | null>(null);`
);

// We need to re-write handleCreateCoupon.
// It's a big block, maybe we can just replace the whole component content using JS or a direct replace string.
fs.writeFileSync(tsxPath, txt);
