"use client";
import { IconSearch, IconEye } from "@tabler/icons-react";
import { Paper, Table, Text, Pagination, Center, TextInput, Group, Chip, Button, Modal, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import { useDisclosure } from '@mantine/hooks';
import { Transaction } from "@/lib/types";
import TransactionDetail from "./TransactionDetail";

// Hàm hỗ trợ phân trang
function chunk<T>(array: T[], size: number): T[][] {
    if (!array.length) return [];
    const head = array.slice(0, size);
    const tail = array.slice(size);
    return [head, ...chunk(tail, size)];
}

const TransactionHistoryTable: React.FC = () => {

    // State for modal control
    const [opened, { open, close }] = useDisclosure(false);

    // State for filters and pagination
    const [transactionTypeFilter, setTransactionTypeFilter] = useState<string>("Tất cả");
    const [timeFilter, setTimeFilter] = useState<string>("Mới nhất");
    const [activePage, setActivePage] = useState<number>(1);

    // State for selected transaction
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

    // Sample transaction data
    const transactions: Transaction[] = [
        {
            id: 1,
            dateTime: "05/12/2024 10:00",
            amount: "+800,000 VND",
            transactionType: "Nhận tiền",
            balance: "5,800,000 VND",
            sender_account_number: "123456789012",
            receiver_account_number: "109846294723",
            message: "Nhận tiền từ tài khoản 123456789012",
        },
        {
            id: 2,
            dateTime: "05/12/2024 13:30",
            amount: "-500,000 VND",
            transactionType: "Thanh toán",
            balance: "5,300,000 VND",
            sender_account_number: "109846294723",
            receiver_account_number: "987654321098",
            message: "Thanh toán hóa đơn mua sắm",
        },
        {
            id: 3,
            dateTime: "04/12/2024 15:15",
            amount: "-1,000,000 VND",
            transactionType: "Chuyển khoản",
            balance: "4,300,000 VND",
            sender_account_number: "109846294723",
            receiver_account_number: "135792468024",
            message: "Chuyển khoản cho đối tác",
        },
        {
            id: 4,
            dateTime: "04/12/2024 18:45",
            amount: "+2,000,000 VND",
            transactionType: "Nhận tiền",
            balance: "6,300,000 VND",
            sender_account_number: "246813579135",
            receiver_account_number: "109846294723",
            message: "Nhận tiền từ tài khoản 246813579135",
        },
        {
            id: 5,
            dateTime: "03/12/2024 09:00",
            amount: "-300,000 VND",
            transactionType: "Thanh toán",
            balance: "6,000,000 VND",
            sender_account_number: "109846294723",
            receiver_account_number: "112233445566",
            message: "Thanh toán tiền điện",
        },
        {
            id: 6,
            dateTime: "03/12/2024 11:20",
            amount: "+1,500,000 VND",
            transactionType: "Nhận tiền",
            balance: "7,500,000 VND",
            sender_account_number: "998877665544",
            receiver_account_number: "109846294723",
            message: "Nhận tiền từ tài khoản 998877665544",
        },
        {
            id: 7,
            dateTime: "02/12/2024 20:45",
            amount: "-2,000,000 VND",
            transactionType: "Chuyển khoản",
            balance: "5,500,000 VND",
            sender_account_number: "109846294723",
            receiver_account_number: "778899001122",
            message: "Chuyển khoản cho người thân",
        },
        {
            id: 8,
            dateTime: "02/12/2024 10:10",
            amount: "+3,000,000 VND",
            transactionType: "Nhận tiền",
            balance: "8,500,000 VND",
            sender_account_number: "556677889900",
            receiver_account_number: "109846294723",
            message: "Nhận tiền từ tài khoản 556677889900",
        },
        {
            id: 9,
            dateTime: "01/12/2024 14:30",
            amount: "-800,000 VND",
            transactionType: "Thanh toán",
            balance: "7,700,000 VND",
            sender_account_number: "109846294723",
            receiver_account_number: "443322110099",
            message: "Thanh toán tiền hàng hóa",
        },
        {
            id: 10,
            dateTime: "01/12/2024 18:50",
            amount: "+5,000,000 VND",
            transactionType: "Nhận tiền",
            balance: "12,700,000 VND",
            sender_account_number: "334455667788",
            receiver_account_number: "109846294723",
            message: "Nhận tiền từ tài khoản 334455667788",
        },
    ];


    // Sort transactions by time
    const sortByTime = (elements: Transaction[], filter: string) => {
        return elements.sort((a, b) => {
            const dateA = new Date(a.dateTime);
            const dateB = new Date(b.dateTime);
            return filter === "Mới nhất"
                ? dateB.getTime() - dateA.getTime()
                : dateA.getTime() - dateB.getTime();
        });
    };

    // Filter transactions based on selected filters
    const filteredTransactions = sortByTime(
        transactions.filter((transaction) => {
            if (transactionTypeFilter === "Tất cả") return true;
            return transaction.transactionType === transactionTypeFilter;
        }),
        timeFilter
    );

    // Chunk the filtered transactions into pages (5 items per page)
    const paginatedTransactions = chunk(filteredTransactions, 5);

    const totalPages = paginatedTransactions.length;
    useEffect(() => {
        if (activePage > totalPages && totalPages > 0) {
            setActivePage(totalPages); // Adjust to the last page
        } else if (activePage === 0 && totalPages > 0) {
            setActivePage(1); // Reset to the first page
        }
    }, [filteredTransactions, activePage, totalPages]);

    // Get current page transactions
    const currentPageTransactions = paginatedTransactions[activePage - 1] || [];

    // Create table rows for current page
    const rows = currentPageTransactions.map((transaction, index) => (
        <Table.Tr
            key={index}
            bg={
                transaction.transactionType === "Chuyển khoản"
                    ? "yellow.1"
                    : transaction.transactionType === "Nhận tiền"
                        ? "green.1"
                        : "red.2"
            }
        >
            <Table.Td>{transaction.dateTime}</Table.Td>
            <Table.Td>{transaction.amount}</Table.Td>
            <Table.Td>{transaction.transactionType}</Table.Td>
            <Table.Td>{transaction.balance}</Table.Td>
            <Table.Td>
                <Button
                    variant="subtle"
                    c="black"
                    style={{
                        backgroundColor: "transparent",
                        "&:hover": {
                            backgroundColor: "transparent",
                        },
                    }}
                    onClick={() => {
                        setSelectedTransaction(transaction);
                        open();
                    }}
                >
                    <IconEye />
                </Button>
            </Table.Td>

        </Table.Tr>
    ));

    return (
        <Paper radius="md" mt="lg" p="xl">
            <Group align="center" justify="space-between" gap="md" pb={16}>
                {/* Search Bar */}
                <TextInput
                    leftSection={<IconSearch size={20} />}
                    placeholder="Tìm kiếm"
                    radius="md"
                />
                {/* Account Info */}
                <Group justify="space-between">
                    <Text mt={5}>
                        Chủ tài khoản: <strong>Hồ Hữu Tâm</strong>
                    </Text>
                    <Text mt={5}>
                        Số tài khoản: <strong>1098462947</strong>
                    </Text>
                    <Text mt={5}>
                        Tổng số giao dịch: <strong>{filteredTransactions.length}</strong>
                    </Text>
                </Group>
            </Group>

            {/* Filter Section */}
            <Group justify="space-between" align="center">
                <Group justify="flex-start" gap="md">
                    <Text>Thời gian:</Text>
                    <Chip.Group multiple={false} value={timeFilter} onChange={setTimeFilter}>
                        <Group justify="center">
                            <Chip value="Mới nhất">Mới nhất</Chip>
                            <Chip value="Cũ nhất">Cũ nhất</Chip>
                        </Group>
                    </Chip.Group>
                </Group>

                <Group justify="flex-end" gap="md">
                    <Text>Loại giao dịch:</Text>
                    <Chip.Group
                        multiple={false}
                        value={transactionTypeFilter}
                        onChange={setTransactionTypeFilter}
                    >
                        <Group justify="center">
                            <Chip value="Tất cả">Tất cả</Chip>
                            <Chip value="Thanh toán" color="red">
                                Thanh toán
                            </Chip>
                            <Chip value="Nhận tiền" color="green">
                                Nhận tiền
                            </Chip>
                            <Chip value="Chuyển khoản" color="yellow">
                                Chuyển khoản
                            </Chip>
                        </Group>
                    </Chip.Group>
                </Group>
            </Group>

            {/* Table */}
            <Table verticalSpacing="sm" mt="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Thời gian</Table.Th>
                        <Table.Th>Giao dịch</Table.Th>
                        <Table.Th>Loại giao dịch</Table.Th>
                        <Table.Th>Số dư hiện tại</Table.Th>
                        <Table.Th>Xem chi tiết</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>

            {/* Pagination */}
            <Center>
                <Pagination
                    total={paginatedTransactions.length}
                    value={activePage}
                    onChange={setActivePage}
                    mt="xl"
                />
            </Center>

            <Modal
                opened={opened}
                onClose={close}
                withCloseButton={false}
                centered
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}>
                <TransactionDetail transaction={selectedTransaction} />
            </Modal>
        </Paper>
    );
};

export default TransactionHistoryTable;
