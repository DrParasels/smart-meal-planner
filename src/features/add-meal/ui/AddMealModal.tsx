import { AutoComplete, Button, Card, Col, Modal, Row, Select } from "antd";
import { useAddMeal } from "../model/useAddMeal";
import { AddMealModalProps } from "../model/types";

export const AddMealModal = (props: AddMealModalProps) => {
  const { open, onClose } = props;
  const vm = useAddMeal(props);
  const {
    filters,
    recipes,
    filteredRecipes,
    ingredients,
    handleSearchRecipes,
    handleChangeIngredients,
    handleAddRecipe,
    onSelect,
  } = vm;

  return (
    <Modal
      title={<h1 className="m-0">Добавить блюдо</h1>}
      closable={{ "aria-label": "Custom Close Button" }}
      open={open}
      onCancel={onClose}
      width={900}
      style={{ top: 30 }}
      footer={null}
    >
      <div>
        <div className="flex justify-between gap-5 pb-10 pt-5">
          <div className="w-full">
            <AutoComplete
              options={recipes
                .filter((item) =>
                  item.name
                    .toLowerCase()
                    .includes(filters.searchRecipes.toLowerCase()),
                )
                .map((item) => ({ value: item.name, label: item.name }))}
              style={{ width: "100%" }}
              onSelect={onSelect}
              onChange={(text) => handleSearchRecipes(text)}
              onInputKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
              placeholder="Название блюда"
            />
          </div>
          <div className="w-full">
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Включающий ингредиенты"
              defaultValue={[]}
              onChange={handleChangeIngredients}
              options={ingredients.map((item) => ({ value: item.name }))}
            />
          </div>
        </div>
        <Row gutter={[16, 16]}>
          {filteredRecipes.map((item) => (
            <Col span={8} key={item.id}>
              <Card
                style={{ width: "100%", height: "100%" }}
                title={item.name}
                hoverable
                onClick={() => console.log("карточка")}
              >
                {item.ingredients.map((item, idx) => (
                  <p key={idx}>{item.name}</p>
                ))}

                <div className="mt-3 flex gap-2">
                  <Button
                    style={{
                      backgroundColor: "#16a34a",
                      borderColor: "#16a34a",
                      color: "#fff",
                    }}
                    onClick={() => handleAddRecipe(item.id)}
                  >
                    Добавить
                  </Button>
                  {/* <Button
                      type="primary"
                      href={`/recipes/${item.id}`}
                      target="_blank"
                    >
                      Подробнее
                    </Button> */}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  );
};
