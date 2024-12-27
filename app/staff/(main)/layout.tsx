"use client";

import { Stack, Group } from "@mantine/core";
import { IconUserPlus, IconHistory, IconCreditCardPay } from "@tabler/icons-react";
import SideMenu from "@/components/SideMenu";
import StaffPortalShortcut from "./components/StaffPortalShortcut";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks/withTypes";
import Loading from "@/components/Loading";

const menuItems = [
    {
        link: "/staff/create-account",
        label: "Tạo tài khoản khách hàng",
        icon: <IconUserPlus />,
        top: true,
    },
    {
        link: "/staff/deposit",
        label: "Nạp tiền vào tài khoản",
        icon: <IconCreditCardPay />,
        top: true,
    },
    {
        link: "/staff/transaction-history",
        label: "Lịch sử giao dịch",
        icon: <IconHistory />,
        top: true,
    },
];

export default function StaffLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const router = useRouter();
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/staff/login");
        }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
        return <Loading />;
    }

    return (
        <Group align="top" preventGrowOverflow={false} grow gap="0" wrap="nowrap">
            <SideMenu forCustomer={false} items={menuItems} />
            <Stack>
                <Group justify="flex-end" mr={40} mt={10}>
                    <StaffPortalShortcut />
                </Group>
                {children}
            </Stack>
        </Group>
    );
}
