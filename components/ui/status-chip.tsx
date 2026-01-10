import { Badge } from "@/components/ui/badge";
import { DocStatus, RequestStatus } from "@/lib/mock-data";

interface StatusChipProps {
    status: DocStatus | RequestStatus | string;
}

export function StatusChip({ status }: StatusChipProps) {
    let variant: "default" | "secondary" | "destructive" | "outline" = "default";

    switch (status) {
        case "Valid":
        case "Fulfilled":
            variant = "default"; 
            break;
        case "Expiring Soon":
        case "Pending":
            variant = "secondary"; 
            break;
        case "Expired":
            variant = "destructive"; 
            break;
        default:
            variant = "outline";
    }

    
    return (
        <Badge variant={variant}>
            {status}
        </Badge>
    );
}
