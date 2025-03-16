import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { FaTimes } from "react-icons/fa";


export default function Filtro({search, setSearch, location, setLocation, date, setDate, clearFilters}) {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Filtrar Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <Label className="pb-1">Nome do Evento</Label>
                    <Input 
                        type="text" 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Buscar evento..."
                    />
                </div>
                <div>
                    <Label className="pb-1">Localização</Label>
                    <Input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        placeholder="Digite a cidade..."
                    />
                </div>
                <div>
                    <Label className="pb-1">Data</Label>
                    <Input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <Button 
                    onClick={clearFilters} 
                    variant="outline" 
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center"
                >
                    <FaTimes className="mr-2" /> Limpar Filtros
                </Button>
            </div>
        </div>
    )
}