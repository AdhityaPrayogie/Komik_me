import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton({ href = "/", label = "Kembali ke Beranda" }: { href?: string; label?: string }) {
    return (
        <Button
            render={<Link href={href} />}
            variant="ghost"
            className="-ml-2.5 h-auto gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-blue-600"
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Button>
    );
}
