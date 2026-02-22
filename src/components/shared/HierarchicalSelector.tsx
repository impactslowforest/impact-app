import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Loader2 } from 'lucide-react';
import pb from '@/config/pocketbase';
import { Label } from '@/components/ui/label';

interface HierarchicalSelectorProps {
    onSelect: (data: {
        country?: string;
        cooperativeId?: string;
        farmerId?: string;
        farmId?: string;
    }) => void;
    initialValues?: {
        country?: string;
        cooperativeId?: string;
        farmerId?: string;
        farmId?: string;
    };
    className?: string;
}

export function HierarchicalSelector({ onSelect, initialValues, className }: HierarchicalSelectorProps) {
    const { t } = useTranslation(['common']);

    const [countries] = useState([
        { id: 'vietnam', name: 'Vietnam' },
        { id: 'laos', name: 'Laos' },
        { id: 'indonesia', name: 'Indonesia' },
    ]);

    const [selectedCountry, setSelectedCountry] = useState(initialValues?.country || '');
    const [cooperatives, setCooperatives] = useState<any[]>([]);
    const [selectedCooperative, setSelectedCooperative] = useState(initialValues?.cooperativeId || '');
    const [farmers, setFarmers] = useState<any[]>([]);
    const [selectedFarmer, setSelectedFarmer] = useState(initialValues?.farmerId || '');
    const [farms, setFarms] = useState<any[]>([]);
    const [selectedFarm, setSelectedFarm] = useState(initialValues?.farmId || '');

    const [loading, setLoading] = useState({
        cooperatives: false,
        farmers: false,
        farms: false,
    });

    // Fetch Cooperatives
    useEffect(() => {
        if (!selectedCountry) {
            setCooperatives([]);
            setSelectedCooperative('');
            return;
        }

        const fetchCooperatives = async () => {
            setLoading(prev => ({ ...prev, cooperatives: true }));
            try {
                const records = await pb.collection('cooperatives').getFullList({
                    filter: `country = "${selectedCountry}"`,
                    sort: 'name',
                });
                setCooperatives(records);
            } catch (err) {
                console.error('Error fetching cooperatives:', err);
            } finally {
                setLoading(prev => ({ ...prev, cooperatives: false }));
            }
        };

        fetchCooperatives();
    }, [selectedCountry]);

    // Fetch Farmers
    useEffect(() => {
        if (!selectedCountry) {
            setFarmers([]);
            setSelectedFarmer('');
            return;
        }

        const fetchFarmers = async () => {
            setLoading(prev => ({ ...prev, farmers: true }));
            try {
                // Fetch farmers by country primarily, and filter by cooperative only if selected
                let filter = `country = "${selectedCountry}"`;
                if (selectedCooperative) {
                    filter = `cooperative = "${selectedCooperative}"`;
                }

                const records = await pb.collection('farmers').getFullList({
                    filter,
                    sort: 'full_name',
                });
                setFarmers(records);
            } catch (err) {
                console.error('Error fetching farmers:', err);
                setFarmers([]);
            } finally {
                setLoading(prev => ({ ...prev, farmers: false }));
            }
        };

        fetchFarmers();
    }, [selectedCountry, selectedCooperative]);

    // Fetch Farms
    useEffect(() => {
        if (!selectedFarmer) {
            setFarms([]);
            setSelectedFarm('');
            return;
        }

        const fetchFarms = async () => {
            setLoading(prev => ({ ...prev, farms: true }));
            try {
                const records = await pb.collection('farms').getFullList({
                    filter: `farmer = "${selectedFarmer}"`,
                    sort: 'farm_name',
                });
                setFarms(records);
            } catch (err) {
                console.error('Error fetching farms:', err);
            } finally {
                setLoading(prev => ({ ...prev, farms: false }));
            }
        };

        fetchFarms();
    }, [selectedFarmer]);

    // Notify parent of changes
    useEffect(() => {
        onSelect({
            country: selectedCountry,
            cooperativeId: selectedCooperative,
            farmerId: selectedFarmer,
            farmId: selectedFarm,
        });
    }, [selectedCountry, selectedCooperative, selectedFarmer, selectedFarm, onSelect]);

    const selectClass = "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {/* Country Select */}
            <div className="space-y-1.5">
                <Label>{t('common:country', 'Country')}</Label>
                <div className="relative">
                    <select
                        value={selectedCountry}
                        onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            setSelectedCooperative('');
                            setSelectedFarmer('');
                            setSelectedFarm('');
                        }}
                        className={selectClass}
                    >
                        <option value="">{t('common:select_country', 'Select Country')}</option>
                        {countries.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                </div>
            </div>

            {/* Cooperative Select */}
            <div className="space-y-1.5">
                <Label>{t('common:cooperative', 'Cooperative/Group')}</Label>
                <div className="relative">
                    <select
                        value={selectedCooperative}
                        onChange={(e) => {
                            setSelectedCooperative(e.target.value);
                            setSelectedFarmer('');
                            setSelectedFarm('');
                        }}
                        disabled={!selectedCountry || loading.cooperatives}
                        className={selectClass}
                    >
                        <option value="">{t('common:select_cooperative', 'Select Cooperative')}</option>
                        {cooperatives.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                    {loading.cooperatives ? (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin opacity-50" />
                    ) : (
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                    )}
                </div>
            </div>

            {/* Farmer Select */}
            <div className="space-y-1.5">
                <Label>{t('common:farmer', 'Farmer/Household')}</Label>
                <div className="relative">
                    <select
                        value={selectedFarmer}
                        onChange={(e) => {
                            setSelectedFarmer(e.target.value);
                            setSelectedFarm('');
                        }}
                        disabled={!selectedCooperative || loading.farmers}
                        className={selectClass}
                    >
                        <option value="">{t('common:select_farmer', 'Select Farmer')}</option>
                        {farmers.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.farmer_code ? `[${f.farmer_code}] ` : ''}{f.full_name || f.name}
                            </option>
                        ))}
                    </select>
                    {loading.farmers ? (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin opacity-50" />
                    ) : (
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                    )}
                </div>
            </div>

            {/* Farm Select */}
            <div className="space-y-1.5">
                <Label>{t('common:farm', 'Farm/Plot')}</Label>
                <div className="relative">
                    <select
                        value={selectedFarm}
                        onChange={(e) => setSelectedFarm(e.target.value)}
                        disabled={!selectedFarmer || loading.farms}
                        className={selectClass}
                    >
                        <option value="">{t('common:select_farm', 'Select Farm')}</option>
                        {farms.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.farm_code ? `[${f.farm_code}] ` : ''}{f.farm_name || f.name}
                            </option>
                        ))}
                    </select>
                    {loading.farms ? (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin opacity-50" />
                    ) : (
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
                    )}
                </div>
            </div>
        </div>
    );
}
