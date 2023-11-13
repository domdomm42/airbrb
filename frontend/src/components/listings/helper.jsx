export const ListingHelpers = () => {
  const handlePropertyTypeChange = (setPropertyType) => (event) => {
    setPropertyType(event.target.value);
  };

  const handleTitleChange = (setTitle) => (event) => {
    setTitle(event.target.value);
  };

  const handleAddressChange = (setAddress) => (event) => {
    setAddress(event.target.value);
  };

  const handlePriceChange = (setPrice) => (event) => {
    setPrice(event.target.value);
  };

  const handleBathroomChange = (setNumBathrooms) => (event) => {
    setNumBathrooms(event.target.value);
  };

  const handleBedroomCountChange = (setNumBedrooms, setBedroomDetails) => (event) => {
    const value = event.target.value;
    const number = parseInt(value, 10);
    if (value === '') {
      setNumBedrooms('');
      setBedroomDetails([]);
    } else if (!isNaN(number)) {
      setNumBedrooms(number);
      setBedroomDetails(Array.from({ length: number }, () => ({ beds: [] })));
    }
  };
  const handleBedTypeChange = (bedroomDetails, setBedroomDetails) => (roomIndex, bedIndex, bedType) => {
    const updatedBedrooms = [...bedroomDetails];
    if (!updatedBedrooms[roomIndex].beds[bedIndex]) {
      updatedBedrooms[roomIndex].beds[bedIndex] = {};
    }
    updatedBedrooms[roomIndex].beds[bedIndex].type = bedType;
    setBedroomDetails(updatedBedrooms);
  };
  const handleThumbnailChange = (setThumbnail, setThumbnailPreview) => (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result);
        setThumbnailPreview(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAmenityChange = (amenities, setAmenities) => (event) => {
    const { value, checked } = event.target;
    setAmenities((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((amenity) => amenity !== value);
      }
    });
  };

  const handleCloseError = (setOpenError) => () => {
    setOpenError(false);
  };

  return {
    handleTitleChange,
    handleAddressChange,
    handlePriceChange,
    handleBathroomChange,
    handlePropertyTypeChange,
    handleBedroomCountChange,
    handleBedTypeChange,
    handleThumbnailChange,
    handleAmenityChange,
    handleCloseError,
  };
};
