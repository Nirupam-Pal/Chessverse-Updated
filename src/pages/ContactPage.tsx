import PageHeader from '@/components/PageHeader'
import Contact from '@/sections/Contact'

/** /contact — enquiry form, contact details and map. */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        docTitle="Contact Us — Chessverse Chess Institute"
        crumb="Contact"
        tag="Get in Touch"
        title={
          <>
            We&apos;d love to <span className="text-gradient italic">hear from you</span>
          </>
        }
        subtitle="Have questions about classes, fees or batches? Drop us a message — we usually reply within a few hours."
      />
      <Contact />
    </>
  )
}
