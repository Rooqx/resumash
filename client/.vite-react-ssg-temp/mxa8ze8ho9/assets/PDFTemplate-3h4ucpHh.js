import { jsxs, jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { u as useInputStore } from "./useInputStores-B01ssLVm.js";
import { create } from "zustand";
const email = "/icons/mail.png";
const github = "/icons/github.png";
const mapPin = "/icons/map-pin.png";
const phone = "/icons/phone.png";
const linkdln = "/icons/linkedin.png";
const portfolio = "/icons/briefcase-business.png";
const useFieldStores = create((set) => ({
  fields: {
    experience: [],
    education: [],
    certificates: [],
    awards: [],
    skills: [],
    projects: [],
    references: []
  },
  addField: (section, index) => set((state) => {
    const currentFields = state.fields[section] || [];
    const newField = {};
    const fields = [...currentFields];
    if (typeof index === "number" && index >= 0 && index < fields.length) {
      fields.splice(index + 1, 0, newField);
    } else {
      fields.push(newField);
    }
    return { fields: { ...state.fields, [section]: fields } };
  }),
  setFields: (data) => set({ fields: data }),
  updateField: (section, index, key, value) => set((state) => {
    const sectionFields = state.fields[section] || [];
    const updatedFields = [...sectionFields];
    updatedFields[index] = { ...updatedFields[index], [key]: value };
    return { fields: { ...state.fields, [section]: updatedFields } };
  }),
  deleteField: (section, index) => set((state) => {
    const sectionFields = state.fields[section];
    if (index < 0 || index >= sectionFields.length) {
      return state;
    }
    const updatedFields = sectionFields.filter((_, i) => i !== index);
    return {
      fields: {
        ...state.fields,
        [section]: updatedFields
      }
    };
  })
}));
const useTagStore = create((set, get) => ({
  fields: {},
  //  Initialize if missing before setting input
  setInput: (name, value) => set((state) => {
    const current = state.fields[name] || {
      tags: [],
      input: "",
      suggestions: []
    };
    return {
      fields: {
        ...state.fields,
        [name]: { ...current, input: value }
      }
    };
  }),
  setTags: (data) => set({ fields: data }),
  //  Initialize if missing before adding tag
  addTag: (name, tag) => set((state) => {
    const current = state.fields[name] || {
      tags: [],
      input: "",
      suggestions: []
    };
    const clean = tag.trim();
    if (!clean || current.tags.includes(clean)) return state;
    return {
      fields: {
        ...state.fields,
        [name]: { ...current, tags: [...current.tags, clean], input: "" }
      }
    };
  }),
  // ✅ Initialize if missing before removing tag
  removeTag: (name, tag) => set((state) => {
    const current = state.fields[name] || {
      tags: [],
      input: "",
      suggestions: []
    };
    return {
      fields: {
        ...state.fields,
        [name]: { ...current, tags: current.tags.filter((t) => t !== tag) }
      }
    };
  }),
  clearTags: (name) => set((state) => ({
    fields: {
      ...state.fields,
      [name]: { tags: [], input: "", suggestions: [] }
    }
  })),
  setSuggestions: (name, suggestions) => set((state) => {
    const current = state.fields[name] || {
      tags: [],
      input: "",
      suggestions: []
    };
    return {
      fields: {
        ...state.fields,
        [name]: { ...current, suggestions }
      }
    };
  }),
  addTags: (name, tags) => set((state) => {
    const current = state.fields[name] || {
      tags: [],
      input: "",
      suggestions: []
    };
    const cleanTags = tags.map((tag) => tag.trim()).filter((tag) => tag && !current.tags.includes(tag));
    return {
      fields: {
        ...state.fields,
        [name]: {
          ...current,
          tags: [...current.tags, ...cleanTags],
          input: ""
        }
      }
    };
  }),
  getTags: (name) => {
    var _a;
    return ((_a = get().fields[name]) == null ? void 0 : _a.tags) || [];
  },
  removeField: (name) => set((state) => {
    const { [name]: _, ...rest } = state.fields;
    return { fields: rest };
  })
}));
const ResumePDF = () => {
  var _a, _b, _c, _d, _e;
  const { inputValue, setInputData } = useInputStore();
  const { fields, setFields } = useFieldStores();
  const tagFields = useTagStore((s) => s.fields);
  const { setTags } = useTagStore();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get("data");
    if (data) {
      const parsed = JSON.parse(data);
      setInputData(parsed.inputValue);
      setFields(parsed.fields);
      setTags(parsed.tagFields);
    }
  }, []);
  return /* @__PURE__ */ jsxs("main", { className: "page", children: [
    /* @__PURE__ */ jsxs("div", { className: "header", children: [
      /* @__PURE__ */ jsx("div", { className: "name", children: (inputValue == null ? void 0 : inputValue.fullName) || "Full Name" }),
      /* @__PURE__ */ jsx("div", { className: "label", children: (inputValue == null ? void 0 : inputValue.label) || "Job Title (e.g Frontend Engineer)" }),
      /* @__PURE__ */ jsxs("div", { className: "contactInfo", children: [
        /* @__PURE__ */ jsxs("div", { className: "contactItem flex justify-center items-center gap-1", children: [
          /* @__PURE__ */ jsx("img", { src: email, className: "icon" }),
          /* @__PURE__ */ jsx("div", { children: (inputValue == null ? void 0 : inputValue.email) || "email@example.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "contactItem flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsx("img", { src: phone, className: "icon" }),
          /* @__PURE__ */ jsx("div", { children: (inputValue == null ? void 0 : inputValue.phone) || "(123) 456-7890" })
        ] }),
        /* @__PURE__ */ jsx("a", { className: "link contactItem", href: (inputValue == null ? void 0 : inputValue.linkdlnUrl) || "#", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center gap-1", children: [
          /* @__PURE__ */ jsx("img", { src: linkdln, className: "icon" }),
          /* @__PURE__ */ jsx("div", { children: "LinkedIn" })
        ] }) }),
        /* @__PURE__ */ jsx("a", { className: "link contactItem", href: (inputValue == null ? void 0 : inputValue.githubUrl) || "#", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: github,
              style: { width: "10px", height: "10px", marginRight: "5px" }
            }
          ),
          /* @__PURE__ */ jsx("div", { children: "GitHub" })
        ] }) }),
        ((inputValue == null ? void 0 : inputValue.city) || (inputValue == null ? void 0 : inputValue.country)) && /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center contactItem", children: [
          /* @__PURE__ */ jsx("img", { src: mapPin, className: "icon" }),
          /* @__PURE__ */ jsxs("div", { className: "contactInfo", children: [
            (inputValue == null ? void 0 : inputValue.city) || "City",
            ", ",
            (inputValue == null ? void 0 : inputValue.country) || "Country"
          ] })
        ] }),
        (inputValue == null ? void 0 : inputValue.portfolioUrl) && /* @__PURE__ */ jsx(
          "a",
          {
            className: "link contactItem",
            href: (inputValue == null ? void 0 : inputValue.portfolioUrl) || "#",
            children: /* @__PURE__ */ jsxs("div", { className: "flex justify-center items-center", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: portfolio,
                  style: {
                    width: "10px",
                    height: "10px",
                    marginRight: "5px"
                  }
                }
              ),
              /* @__PURE__ */ jsx("div", { children: "Portfolio" })
            ] })
          }
        )
      ] })
    ] }),
    (inputValue == null ? void 0 : inputValue.summary) && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Summary" }),
      /* @__PURE__ */ jsx("div", { className: "jobSummary", children: inputValue == null ? void 0 : inputValue.summary })
    ] }),
    fields["skills"] && fields["skills"].length > 0 && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Skills" }),
      fields["skills"].map((field, index) => {
        var _a2, _b2, _c2, _d2;
        return /* @__PURE__ */ jsxs("div", { className: "skillItem", children: [
          /* @__PURE__ */ jsx("div", { className: "skillName", children: field.skillName || "Skill Category" }),
          /* @__PURE__ */ jsxs("div", { className: "skillLevel", children: [
            "Technologies:",
            " ",
            (((_b2 = (_a2 = tagFields[`skills-${index}`]) == null ? void 0 : _a2.tags) == null ? void 0 : _b2.length) ?? 0) > 0 ? /* @__PURE__ */ jsx("span", { style: { fontWeight: "bold", color: "#3a3a3a" }, children: (_d2 = (_c2 = tagFields[`skills-${index}`]) == null ? void 0 : _c2.tags) == null ? void 0 : _d2.join(", ") }) : /* @__PURE__ */ jsx("span", { style: { color: "#777" }, children: "No technologies added" })
          ] })
        ] }, index);
      })
    ] }),
    ((_a = fields["experience"]) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Work Experience" }),
      fields["experience"].map((job, index) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxs("div", { className: "jobItem", children: [
          /* @__PURE__ */ jsxs("div", { className: "jobHeader", children: [
            /* @__PURE__ */ jsxs("div", { className: "", children: [
              /* @__PURE__ */ jsx("div", { className: "company", children: job.companyName || "Company Name" }),
              /* @__PURE__ */ jsx("div", { className: "position", children: job.jobPosition || "Job Position" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "date", children: [
              job.jobStartDate || "Start Date",
              " -",
              " ",
              job.jobEndDate || "Present"
            ] })
          ] }),
          job.jobSummary && /* @__PURE__ */ jsx("div", { className: "jobSummary", children: job.jobSummary }),
          ((_b2 = (_a2 = tagFields[`jobHighlights-${index}`]) == null ? void 0 : _a2.tags) == null ? void 0 : _b2.length) > 0 && /* @__PURE__ */ jsx("ul", { className: "jobHighlights list-disc", children: tagFields[`jobHighlights-${index}`].tags.map(
            (item, i) => /* @__PURE__ */ jsxs("div", { className: " flex items-start", children: [
              /* @__PURE__ */ jsx("b", { className: "text-lg ", children: "•" }),
              /* @__PURE__ */ jsx("div", { className: "ml-2 mt-1 leading-5", children: item })
            ] }, i)
          ) })
        ] }, index);
      })
    ] }),
    ((_b = fields["education"]) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Education" }),
      fields["education"].map((edu, index) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "educationItem",
          style: {
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row"
          },
          children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "institution", children: edu.institution || "Institution Name" }),
              /* @__PURE__ */ jsxs("div", { className: "studyType", children: [
                edu.studyType || "Study Type",
                " in ",
                edu.area || "Area"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "date", children: [
              edu.startDate || "Start",
              " - ",
              edu.endDate || "Present"
            ] }) })
          ]
        },
        index
      ))
    ] }),
    ((_c = fields["projects"]) == null ? void 0 : _c.length) > 0 && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Projects" }),
      fields["projects"].map((project, index) => {
        var _a2;
        return /* @__PURE__ */ jsxs("div", { className: "projectItem", children: [
          /* @__PURE__ */ jsx("div", { className: "projectName", children: project.name || "Project Name" }),
          /* @__PURE__ */ jsxs("div", { className: "projectDescription", children: [
            project.description || "Project description",
            (_a2 = project[`projectTechnologies-${index}`]) == null ? void 0 : _a2.join(", ")
          ] }),
          project.url && /* @__PURE__ */ jsx(
            "a",
            {
              className: "contactItem",
              href: project.url,
              style: { marginTop: "5px" },
              children: "View Project"
            }
          )
        ] }, index);
      })
    ] }),
    fields["certificates"] && ((_d = fields["certificates"]) == null ? void 0 : _d.length) > 0 && fields["certificates"].some(
      (f) => f.certificateName && f.certificateName.trim() !== ""
    ) && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Certifications" }),
      fields["certificates"].map((certificate, index) => /* @__PURE__ */ jsxs("div", { className: "projectItem", children: [
        /* @__PURE__ */ jsx("div", { className: "projectName", children: certificate.certificateName }),
        /* @__PURE__ */ jsxs("div", { className: "projectDescription", children: [
          certificate.certificateIssuer ? `Issued by ${certificate.certificateIssuer} – ` : "",
          certificate.certificateDate ? `(${certificate.certificateDate})` : ""
        ] }),
        certificate.certificateUrl && /* @__PURE__ */ jsx("a", { className: "contactItem", href: certificate.certificateUrl, children: "View Certificate" })
      ] }, index))
    ] }),
    ((_e = fields["awards"]) == null ? void 0 : _e.length) > 0 && fields["awards"].some(
      (f) => f.awardTitle && f.awardTitle.trim() !== ""
    ) && /* @__PURE__ */ jsxs("div", { className: "section", children: [
      /* @__PURE__ */ jsx("div", { className: "sectionTitle", children: "Awards" }),
      fields["awards"].map((award, index) => /* @__PURE__ */ jsxs("div", { className: "projectItem", children: [
        /* @__PURE__ */ jsx("div", { className: "projectName", children: award.awardTitle || award.title }),
        /* @__PURE__ */ jsxs("div", { className: "projectDescription", children: [
          award.awarder && `Awarded by ${award.awarder} – `,
          award.awardDate && `(${award.awardDate})`
        ] }),
        award.awardSummary && /* @__PURE__ */ jsx("div", { className: "projectDescription", children: award.awardSummary })
      ] }, index))
    ] })
  ] });
};
export {
  ResumePDF as R,
  useFieldStores as a,
  useTagStore as u
};
