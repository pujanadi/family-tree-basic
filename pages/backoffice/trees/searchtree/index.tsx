import { useState, useRef } from "react";
import Head from "next/head";
import BackofficeLayout from "@/components/backoffice/BackofficeLayout";
import data from "@/data/family-1.json";

const TreesPage = () => {
    const [query, setQuery] = useState("");
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [show, setShow] = useState(false);
    const [treeObject, setTreeObject] = useState<Member[]>( JSON.parse(JSON.stringify(Object.values(data.people))) );

    // interface
    interface Member {
        id: string;
        name: string;
        birthYear: number;
        parentId?: string | null;
        spouseIds: string[];
        childIds: string[];
    }

    // const items: string[] = Object.values(data.people).map(
    //     (person: any) => person.name
    // );

    //convert data.people object to array and map to names
    // const treeObject: any[] = JSON.parse(JSON.stringify(Object.values(data.people)));
    // setTreeObject(treeObject);


    const nameRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const birtyYearRef = useRef<HTMLInputElement>(null);
    const deathYearRef = useRef<HTMLInputElement>(null);
    const parentRef = useRef<HTMLSelectElement>(null);
    const spouseRef = useRef<HTMLSelectElement>(null);
    const divorcedRef = useRef<HTMLSelectElement>(null);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 0) {
      const result = treeObject.filter((member) =>
        member.name.toLowerCase().includes(value.toLowerCase())
      );
      setFiltered(result);
      setShow(true);
    } else {
      setShow(false);
    }
  };

  const handleSelect = (value: string) => {
    setQuery(value);
    setShow(false);
  };

  const handleAddMember = () => {
        //create a new member object
        const newMember = {
            "id": "child-333",
            "name": nameRef.current?.value || "Unnamed",
            "gender": genderRef.current?.value || "unknown",
            "birthYear": birtyYearRef.current?.value || null,
            "deathYear": deathYearRef.current?.value || null,
            "parentId": parentRef.current?.value || "",
            "spouseId": [spouseRef.current?.value || null],
            "divorced": divorcedRef.current?.value || "N",
            "childIds": []
        }

        //add the new member to the members array
        const newTreeObject = [...treeObject, newMember];
        //get parent
        const parent : Member = getParent(newTreeObject, newMember.parentId);
        //update parent's childIds array
        parent.childIds.push(newMember.id);
        //get spouse
        const spouse : Member = getSpouse(treeObject, newMember.spouseId);
        //update spouse's spouseIds array
        spouse.spouseIds.push(newMember.spouseIds);
        
        alert("Member added!");
    }

    function addMember(tree: Member[], member: Member) {
        return [...tree, member];
    }

    function getParent(tree: Member[], parentId: string) : Member {
        return tree.find(member => member.id === parentId) || {} as Member;
    }

    function getSpouse(tree: Member[], spouseId: string) : Member {
        return tree.find(member => member.id === spouseId) || {} as Member;
    }



    return (
    <>
        <Head>
        <title>Backoffice - Family Tree</title>
        </Head>
        <BackofficeLayout
        title="Family trees"
        subtitle="Browse, filter, and manage published family trees across the workspace."
        >

        <h1 className="text-2xl font-bold mb-4">Family Tree — Edit Members</h1>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-sm text-slate-400">

            <input 
            type="button" 
            value="Back" 
            onClick={() => window.location.href="/backoffice/trees" }
            className="flex mt-6 rounded-md bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-misty-teal-600 cursor-pointer justify-end" />


            <div className="grid grid-cols-2 gap-4 mt-4 
            [&_label]:block [&_label]:font-semibold [&_label]:pb-1 [&_label]:text-left
            [&_select]:justify-start [&_input]:w-full [&_input]:rounded-md [&_input]:py-1 [&_:focus]:border-misty-teal-400 [&_:focus]:outline-none [&_:focus]:ring-1 [&_:focus]:ring-misty-teal-400[&_select]:w-full [&_select]:rounded-md [&_select]:py-1 
            [&_select]:w-full [&_select]:rounded-md [&_select]:py-1 
            ">
            
                <div>
                    <label>Name:</label>
                    <input
                    type="text"
                    ref={nameRef}
                    // value={form.name}
                    // onChange={handleChange}
                    required
                    />
                </div>

                <div>
                    <label>Gender:</label>
                    <select name="gender">
                        <option value="" disabled selected hidden>Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>  
                    </select>
                </div>

            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 
            [&_label]:block [&_label]:font-semibold [&_label]:pb-1 [&_label]:text-left
            [&_input]:w-full [&_input]:rounded-md [&_input]:py-1 [&_:focus]:border-misty-teal-400 [&_:focus]:outline-none [&_:focus]:ring-1 [&_:focus]:ring-misty-teal-400[&_select]:w-full [&_select]:rounded-md [&_select]:py-1 
            ">
                <div>
                    <label>Birth Year:</label>
                    <input type="text" ref={birtyYearRef} />
                </div>
                <div>
                    <label>Death Year (optional):</label>
                    <input type="text" ref={deathYearRef} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 
            [&_label]:block [&_label]:font-semibold [&_label]:pb-1 [&_label]:text-left
            [&_input]:w-full [&_input]:rounded-md [&_input]:py-1 [&_:focus]:border-misty-teal-400 [&_:focus]:outline-none [&_:focus]:ring-1 [&_:focus]:ring-misty-teal-400
            [&_select]:w-full [&_select]:rounded-md [&_select]:py-1 
            ">
                <div>
                    <label>Parent:</label>
                    <select ref={parentRef}>
                        <option disabled selected hidden>Select</option>
                        {treeObject.map(({id, name, birthYear, spouseIds, childIds}) => (
                            <option key={id} value={id}>{name}</option>
                        ))}
                    </select>
                </div>
            <div>
                
        </div>
        
        </div>

            <div className="grid grid-cols-2 gap-4 mt-4 
            [&_label]:block [&_label]:font-semibold [&_label]:pb-1 [&_label]:text-left
            [&_input]:w-full [&_input]:rounded-md [&_input]:py-1 [&_:focus]:border-misty-teal-400 [&_:focus]:outline-none [&_:focus]:ring-1 [&_:focus]:ring-misty-teal-400
            [&_select]:w-full [&_select]:rounded-md [&_select]:py-1 
            ">
                <div>
                    <label>Spouse:</label>
                    <select ref={spouseRef}>
                        <option value="" disabled selected hidden>Select</option>
                        <option value="male">John Carter</option>
                        <option value="female">Ford Mustang</option>  
                    </select>
                </div>
                <div>
                    <label>Divorced (optional):</label>
                    <select ref={divorcedRef}>
                        <option value="" disabled selected hidden>Select</option>
                        <option value="N">No</option>
                        <option value="Y">Yes</option>  
                    </select>
                </div>
            </div>

            <input 
                type="button" 
                value="Add member" 
                onClick={handleAddMember}
                className="mt-6 rounded-md bg-misty-teal-500 px-4 py-2 text-sm font-semibold text-white hover:bg-misty-teal-600 cursor-pointer" />

        </div>

        
        </BackofficeLayout>
    </>
    );
}

export default TreesPage;
