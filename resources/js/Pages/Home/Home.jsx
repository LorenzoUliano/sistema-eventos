import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"


export default function Home() {
    return <AuthenticatedLayout>
        <Head title="Home" />
        
    </AuthenticatedLayout>
}