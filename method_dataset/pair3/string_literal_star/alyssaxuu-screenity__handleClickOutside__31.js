    const handleClickOutside = (event) => {
      if (props.name != "hideUI") return;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !dropdownInRef.current.contains(event.target)
      ) {
        if (dropdownRef.current.querySelector(":hover")) return;
        if (dropdownInRef.current.querySelector(":hover")) return;
        // Check if any children of dropdownref are clicked also
        let children = dropdownRef.current.querySelectorAll("*");
        for (let i = 0; i < children.length; i++) {
          if (children[i].contains(event.target)) return;
        }

        dropdownRef.current.classList.remove("labelDropdownActive");
      }
    };
