import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head } from "@inertiajs/react"


export default function Home() {
    return <AuthenticatedLayout
        header={
            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                Home
            </h2>
        }    
    >
        <Head title="Home" />

        <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1>Pagina inicial</h1>
                            <div>
                                <p>Teste</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
    </AuthenticatedLayout>
}