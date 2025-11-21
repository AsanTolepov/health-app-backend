// src/pages/user/help.tsx

import React from 'react';
import { Card, CardBody, CardHeader, Button, Input, Textarea, Accordion, AccordionItem } from '@heroui/react';
import { Icon } from '@iconify/react';

const faqData = [
    { title: "Uchrashuvni qanday belgilash mumkin?", content: "Dashboard sahifasidagi 'Uchrashuvlar' bo'limida 'Kalendarni ko'rish' tugmasini bosing. Ochilgan sahifada bo'sh vaqtni tanlab, shifokor va xizmat turini belgilang." },
    { title: "Shifokor bilan onlayn maslahat qanday ishlaydi?", content: "Kutilayotgan uchrashuvlar ro'yxatida video qo'ng'iroq belgisini bosish orqali belgilangan vaqtda onlayn maslahatni boshlashingiz mumkin." },
    { title: "Tibbiy qaydlarimni qanday yuklab olsam bo'ladi?", content: "Profil sahifasidagi 'Tibbiy qaydlar' bo'limiga o'ting. Har bir qayd yonida yuklab olish (download) belgisi mavjud." },
    { title: "Parolni qanday tiklash mumkin?", content: "Tizimga kirish oynasida 'Parolni unutdingizmi?' havolasini bosing va email manzilingizni kiriting. Tiklash uchun yo'riqnoma pochtangizga yuboriladi." }
];

const HelpPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 items-center text-center">
        <Icon icon="lucide:life-buoy" className="text-5xl text-primary" />
        <h1 className="text-3xl font-bold dark:text-white">Yordam Markazi</h1>
        <p className="text-gray-500 dark:text-gray-400">Savollaringizga javob toping yoki biz bilan bog'laning</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQ bo'limi */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold dark:text-white">Ko'p Beriladigan Savollar</h2>
          <Accordion variant="bordered" className="dark:text-white">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} title={faq.title}>
                <p className="text-gray-600 dark:text-gray-300">{faq.content}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Qo'llab-quvvatlash bilan bog'lanish */}
        <div>
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <h2 className="text-xl font-semibold dark:text-white">Qo'llab-quvvatlashga Murojaat</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Ismingiz" placeholder="Ismingizni kiriting" />
              <Input type="email" label="Email" placeholder="Email manzilingiz" />
              <Textarea label="Xabar" placeholder="Muammo yoki taklifingizni yozing..." />
              <Button color="primary" fullWidth>Yuborish</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;