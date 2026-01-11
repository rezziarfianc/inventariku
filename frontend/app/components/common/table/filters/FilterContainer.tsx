import { Card, CardBody } from "@heroui/react";
import { memo } from "react";


function FilterContainer({ children}: { children: React.ReactNode }) {
    return (
        <Card className="self-end w-fit mb-2">
            <CardBody className="p-2">
                <div className="flex flex-row gap-2 items-center">
                    {children}
                </div>
            </CardBody>
        </Card>
    );
}

export default memo(FilterContainer);