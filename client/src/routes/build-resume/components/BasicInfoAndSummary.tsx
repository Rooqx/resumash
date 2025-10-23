import Input from '@/components/Input'
import useInputStore from '@/lib/stores/useInputStores'
import Textarea from '@/components/Textarea'

export default function BasicInfoAndSummary() {
  const { inputValue, setInputValue } = useInputStore()

  return (
    <>
      {/* ================== Basic Info ================== */}
      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-semibold"> Basic Info</h3>
        <div className="border p-4 rounded-md space-y-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              labelFor="fullName"
              value={inputValue.fullName}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Full Name"
              placeholder="Enter your full name"
            />
            <Input
              type="text"
              labelFor="label"
              value={inputValue.label}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Job Title"
              placeholder="Enter your profession"
            />
          </div>

          {/* ================== Contact Info ================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="email"
              labelFor="email"
              value={inputValue.email}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Email"
              placeholder="Enter your email"
            />
            <Input
              type="tel"
              labelFor="phone"
              value={inputValue.phone}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Phone Number"
              placeholder="Enter your phone number"
            />
            <Input
              type="text"
              labelFor="city"
              value={inputValue.city}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="City"
              placeholder="Enter your city"
            />
            <Input
              type="text"
              labelFor="country"
              value={inputValue.country}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Country"
              placeholder="Enter your country"
            />
          </div>

          {/* ================== Links ================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="url"
              labelFor="linkdlnUrl"
              value={inputValue.linkdlnUrl}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="LinkedIn URL"
              placeholder="Enter your LinkedIn profile URL"
            />
            <Input
              type="url"
              labelFor="githubUrl"
              value={inputValue.githubUrl}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="GitHub URL"
              placeholder="Enter your GitHub profile URL"
            />
            <Input
              type="url"
              labelFor="portfolioUrl"
              value={inputValue.portfolioUrl}
              onChange={(e) => setInputValue(e.target.name, e.target.value)}
              inputTittle="Portfolio URL"
              placeholder="Enter your portfolio URL"
            />
          </div>
        </div>
      </div>

      {/* ================== Summary ================== */}
      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-semibold">Summary</h3>
        <div className="border p-4 rounded-md space-y-3">
          <Textarea
            labelFor="summary"
            value={inputValue.summary}
            onChange={(e) => setInputValue(e.target.name, e.target.value)}
            inputTittle="Professional Summary"
            placeholder="Enter your professional summary or career objective"
          />
        </div>
      </div>
    </>
  )
}
