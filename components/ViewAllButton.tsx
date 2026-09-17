import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ViewAllButton({ href }: { href: string }) {
    return (
        <Button
            render={<Link href={href} />}
            variant="secondary"
            className="group/button h-auto shrink-0 gap-1 rounded-full bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 sm:text-sm"
        >
            Lihat Semua
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/button:translate-x-0.5" />
        </Button>
    );
}
