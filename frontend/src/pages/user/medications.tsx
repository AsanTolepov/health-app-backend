// src/pages/user/medications.tsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
// import UserLayout from "../../components/layout/user-layout"; // <-- BU QATORNI O'CHIRAMIZ

// Interfeys va mock ma'lumotlar o'zgarishsiz qoladi
interface Medication { id: string; type: string; dosagePerDay: string; doctor: string; startDate: string; }
const DORI_TURLARI = [ "Paratsetamol", "Aspirin", "Ibuprofen", "Vitamin D", "Amoksiklav", "Nurofen", "Azitromitsin",];
const DOZALAR = ["1 marta", "2 marta", "3 marta", "4 marta"];
const DOCTORLAR = [ "Dr. Abduraxmanov", "Dr. Sodiqova", "Dr. Karimov", "Dr. Rustamova", "Dr. Tulegenov",];

const Medications: React.FC = () => {
  const [meds, setMeds] = useState<Medication[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [newMed, setNewMed] = useState<Omit<Medication, 'id' | 'startDate'>>({ type: "", dosagePerDay: "", doctor: "" });

  useEffect(() => { const saved = localStorage.getItem("medications"); if (saved) setMeds(JSON.parse(saved)); }, []);
  const saveToStorage = (data: Medication[]) => { setMeds(data); localStorage.setItem("medications", JSON.stringify(data)); };

  const handleSave = () => {
    if (!newMed.type || !newMed.dosagePerDay || !newMed.doctor) {
      alert("Iltimos, barcha maydonlarni tanlang!");
      return;
    }
    const updated = [ ...meds, { ...newMed, id: Date.now().toString(), startDate: new Date().toISOString().split("T")[0], }, ];
    saveToStorage(updated);
    setShowModal(false);
    setNewMed({ type: "", dosagePerDay: "", doctor: "" });
  };

  const deleteMed = (id: string) => {
    if (window.confirm("Ushbu dorini o‘chirmoqchimisiz?")) {
      const updated = meds.filter((m) => m.id !== id);
      saveToStorage(updated);
    }
  };

  const filteredMeds = meds.filter((m) =>
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // <UserLayout> tegi olib tashlandi
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">💊 Dori vositalari</h1>

      <Card>
        <CardHeader className="flex justify-between items-center p-4">
          <Input
            placeholder="Dori qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            startContent={<Icon icon="lucide:search" className="text-gray-400" />}
          />
          <Button
            color="primary"
            startContent={<Icon icon="lucide:plus" />}
            onPress={() => setShowModal(true)}
          >
            Yangi Dori Qo'shish
          </Button>
        </CardHeader>

        <CardBody className="p-0">
          <div className="divide-y divide-gray-200">
            {filteredMeds.length > 0 ? (
              filteredMeds.map((med, index) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{med.type}</h3>
                    <p className="text-sm text-gray-600">
                      <Icon icon="lucide:clock" className="inline-block mr-1" /> {med.dosagePerDay} / kun
                    </p>
                    <p className="text-sm text-gray-500">
                      <Icon icon="lucide:user" className="inline-block mr-1" /> {med.doctor} | {med.startDate}
                    </p>
                  </div>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => deleteMed(med.id)}
                    title="O'chirish"
                  >
                    <Icon icon="lucide:trash" />
                  </Button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-6">
                Dori ro‘yxati bo‘sh. Yangi dori qo'shish uchun yuqoridagi tugmani bosing.
              </p>
            )}
          </div>
        </CardBody>
      </Card>

      <Button
        variant="flat"
        color="success"
        fullWidth
        startContent={<Icon icon="lucide:download" />}
        onPress={() => {
          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(meds, null, 2));
          const a = document.createElement("a");
          a.href = dataStr;
          a.download = "dorilar.json";
          a.click();
        }}
      >
        Dori ro‘yxatini yuklab olish
      </Button>

      {/* Modal */}
      <Modal isOpen={showModal} onOpenChange={setShowModal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-bold text-lg">🧾 Yangi dori qo'shish</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Select
                  label="Dori turi"
                  placeholder="Tanlang..."
                  selectedKeys={newMed.type ? [newMed.type] : []}
                  onChange={(e) => setNewMed({ ...newMed, type: e.target.value })}
                >
                  {DORI_TURLARI.map((item) => ( <SelectItem key={item} value={item}>{item}</SelectItem> ))}
                </Select>

                <Select
                  label="Bir kunda necha marta ichiladi"
                  placeholder="Tanlang..."
                  selectedKeys={newMed.dosagePerDay ? [newMed.dosagePerDay] : []}
                  onChange={(e) => setNewMed({ ...newMed, dosagePerDay: e.target.value })}
                >
                  {DOZALAR.map((item) => ( <SelectItem key={item} value={item}>{item}</SelectItem> ))}
                </Select>

                <Select
                  label="Tavsiya qilgan shifokor"
                  placeholder="Tanlang..."
                  selectedKeys={newMed.doctor ? [newMed.doctor] : []}
                  onChange={(e) => setNewMed({ ...newMed, doctor: e.target.value })}
                >
                  {DOCTORLAR.map((item) => ( <SelectItem key={item} value={item}>{item}</SelectItem> ))}
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>Bekor qilish</Button>
                <Button color="primary" onPress={handleSave}>Saqlash</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
    // </UserLayout> tegi olib tashlandi
  );
};

export default Medications;