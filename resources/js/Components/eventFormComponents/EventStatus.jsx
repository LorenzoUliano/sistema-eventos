export const EventStatus = ({ data, setData }) => (
    <select
        value={data.status}
        onChange={(e) => setData("status", e.target.value)}
        className="w-full bg-background border border-border rounded-md p-2.5 focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
        <option value="canceled">Cancelado</option>
    </select>
);