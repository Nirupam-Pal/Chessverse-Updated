import { useState } from 'react'
import { MessageCircle, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface FAQ {
  id: string
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    id: 'age',
    question: 'What is the minimum age to start learning chess?',
    answer: 'Children as young as 4-5 years old can start learning chess! We have specialized programs for different age groups with age-appropriate teaching methods.',
  },
  {
    id: 'beginner',
    question: 'Do you teach complete beginners?',
    answer: 'Absolutely! We welcome students of all levels, from absolute beginners to advanced players. Our experienced coaches tailor lessons to match your skill level.',
  },
  {
    id: 'classes',
    question: 'What are your class timings?',
    answer: 'We offer classes Mon-Sat from 6 AM to 9 PM. Both online and offline (Agartala) options are available. You can choose a schedule that fits you best.',
  },
  {
    id: 'online',
    question: 'Do you offer online classes?',
    answer: 'Yes! We provide both online and offline classes. Online sessions are conducted via video call with interactive boards so you can see the moves in real-time.',
  },
  {
    id: 'demo',
    question: 'How do I book a free demo class?',
    answer: 'Simply fill the booking form above with your details and preferred time. You can also click the WhatsApp button to send your inquiry directly to our team.',
  },
  {
    id: 'fees',
    question: 'What are your course fees?',
    answer: 'Our fees vary based on the course level and duration. For detailed pricing information, please contact us via WhatsApp or the contact form above.',
  },
  {
    id: 'tournament',
    question: 'Do you conduct tournaments or competitions?',
    answer: 'Yes! We regularly organize internal tournaments and help students participate in official chess competitions at district and national levels.',
  },
  {
    id: 'duration',
    question: 'What is the duration of each class?',
    answer: 'Standard classes are 45 minutes to 1 hour long. We also offer customized durations based on your requirements and learning pace.',
  },
  {
    id: 'trial',
    question: 'Is the demo class really free?',
    answer: 'Yes, completely free! It\'s a no-obligation trial session where you can experience our teaching style and meet the instructor.',
  },
  {
    id: 'certification',
    question: 'Do you provide certifications?',
    answer: 'Yes, upon completing our courses, students receive certificates. We also prepare students for official chess certification exams.',
  },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-28 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#128C7E] to-[#25D366] shadow-lg hover:shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
        data-testid="chatbot-toggle"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-24 z-50 w-96 max-h-[600px] rounded-2xl bg-gradient-to-b from-void to-twilight border border-sky/20 shadow-2xl flex flex-col overflow-hidden"
            data-testid="chatbot-box"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-royal to-sky p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-ivory text-lg">ChessVerse Bot</h3>
                <p className="text-xs text-white/80">Ask us anything about chess classes</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ivory hover:bg-white/10 p-1 rounded-lg transition-colors"
                data-testid="chatbot-close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FAQs List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full text-left p-3 rounded-xl bg-white/5 border border-sky/15 hover:border-sky/40 transition-all duration-300 group-hover:bg-white/8"
                    data-testid={`faq-question-${faq.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-ivory font-medium flex-1">{faq.question}</p>
                      <motion.div
                        animate={{ rotate: expandedFAQ === faq.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4 text-sky shrink-0 mt-1" />
                      </motion.div>
                    </div>
                  </button>

                  {/* Answer */}
                  <AnimatePresence>
                    {expandedFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="ml-3 p-3 rounded-xl bg-sky/10 border border-sky/20"
                          data-testid={`faq-answer-${faq.id}`}
                        >
                          <p className="text-sm text-ghost leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-sky/15 p-4 bg-white/5">
              <p className="text-xs text-ghost text-center mb-3">
                Can't find your answer? Contact us!
              </p>
              <a
                href="https://wa.me/917629037237?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20chess%20classes."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#128C7E] to-[#25D366] hover:shadow-lg text-ivory text-sm font-medium transition-all duration-300"
                data-testid="chatbot-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
