import pytest
from app import entities


# async def test_get_all_battery_cells(authorized_client, test_battery_cells):
#     res = authorized_client.get("/posts/")

#     async def validate(post):
#         return schemas.PostOut(**post)
#     posts_map = map(validate, res.json())
#     posts_list = list(posts_map)

#     assert len(res.json()) == len(test_posts)
#     assert res.status_code == 200


# async def test_unauthorized_user_get_all_posts(client, test_posts):
#     res = client.get("/posts/")
#     assert res.status_code == 401


# async def test_unauthorized_user_get_one_post(client, test_posts):
#     res = client.get(f"/posts/{test_posts[0].id}")
#     assert res.status_code == 401


# async def test_get_one_post_not_exist(authorized_client, test_posts):
#     res = authorized_client.get(f"/posts/88888")
#     assert res.status_code == 404


# async def test_get_one_post(authorized_client, test_posts):
#     res = authorized_client.get(f"/posts/{test_posts[0].id}")
#     post = schemas.PostOut(**res.json())
#     assert post.Post.id == test_posts[0].id
#     assert post.Post.content == test_posts[0].content
#     assert post.Post.title == test_posts[0].title


@pytest.mark.parametrize("cell_name_id, cycles, cathode, anode, capacity_ah, type, source, temperature_c, max_state_of_charge, min_state_of_charge, depth_of_discharge, charge_capacity_rate, discharge_capacity_rate", [
    (
        "PPPCALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
        1014.00,
        "LCO",
        "graphite",
        2.35,
        "prismatic",
        "calce",
        25.00,
        4,
        2.0,
        100.00,
        1.80,
        0.60,

    ),
    (
        "HHHHCALCE_CX2-16_prism_LCO_25C_0-100_0.5/0.5C_a",
        1014.00,
        "LCO",
        "graphite",
        2.35,
        "prismatic",
        "HNEI",
        25.00,
        4,
        2.0,
        100.00,
        1.80,
        0.60,
    )
])
async def test_create_battery_cell(authorized_client, test_user, cell_name_id, cycles, cathode, anode, capacity_ah, type, source, temperature_c, max_state_of_charge, min_state_of_charge, depth_of_discharge, charge_capacity_rate, discharge_capacity_rate):
    res = await authorized_client.post(
        "/battery-cells/", json={"cell_name_id": cell_name_id,
                                 "cycles": cycles,
                                 "cathode": cathode,
                                 "anode": anode,
                                 "capacity_ah": capacity_ah,
                                 "type": type,
                                 "source": source,
                                 "temperature_c": temperature_c,
                                 "max_state_of_charge": max_state_of_charge,
                                 "min_state_of_charge": min_state_of_charge,
                                 "depth_of_discharge": depth_of_discharge,
                                 "charge_capacity_rate": charge_capacity_rate,
                                 "discharge_capacity_rate": discharge_capacity_rate,
                                 })

    #  very important to add the forward slash "/" after the /battery-cells/ for JSONDecodeError

    created_battery_cell = entities.Battery_Cells(**res.json())

    assert res.status_code == 201
    assert created_battery_cell.cell_name_id == cell_name_id
    assert created_battery_cell.cycles == cycles
    assert created_battery_cell.cathode == cathode
    assert created_battery_cell.anode == anode
    assert created_battery_cell.capacity_ah == capacity_ah
    assert created_battery_cell.type == type
    assert created_battery_cell.source == source
    assert created_battery_cell.temperature_c == temperature_c
    assert created_battery_cell.max_state_of_charge == max_state_of_charge
    assert created_battery_cell.min_state_of_charge == min_state_of_charge
    assert created_battery_cell.depth_of_discharge == depth_of_discharge
    assert created_battery_cell.charge_capacity_rate == charge_capacity_rate
    assert created_battery_cell.discharge_capacity_rate == discharge_capacity_rate
    assert created_battery_cell.owner_id == test_user['id']


# async def test_create_post_default_published_true(authorized_client, test_user, test_posts):
#     res = authorized_client.post(
#         "/posts/", json={"title": "arbitrary title", "content": "aasdfjasdf"})

#     created_post = schemas.Post(**res.json())
#     assert res.status_code == 201
#     assert created_post.title == "arbitrary title"
#     assert created_post.content == "aasdfjasdf"
#     assert created_post.published == True
#     assert created_post.owner_id == test_user['id']


# async def test_unauthorized_user_create_post(client, test_user, test_posts):
#     res = client.post(
#         "/posts/", json={"title": "arbitrary title", "content": "aasdfjasdf"})
#     assert res.status_code == 401


# async def test_unauthorized_user_delete_Post(client, test_user, test_posts):
#     res = client.delete(
#         f"/posts/{test_posts[0].id}")
#     assert res.status_code == 401


# async def test_delete_post_success(authorized_client, test_user, test_posts):
#     res = authorized_client.delete(
#         f"/posts/{test_posts[0].id}")

#     assert res.status_code == 204


# async def test_delete_post_non_exist(authorized_client, test_user, test_posts):
#     res = authorized_client.delete(
#         f"/posts/8000000")

#     assert res.status_code == 404


# async def test_delete_other_user_post(authorized_client, test_user, test_posts):
#     res = authorized_client.delete(
#         f"/posts/{test_posts[3].id}")
#     assert res.status_code == 403


# async def test_update_post(authorized_client, test_user, test_posts):
#     data = {
#         "title": "updated title",
#         "content": "updatd content",
#         "id": test_posts[0].id

#     }
#     res = authorized_client.put(f"/posts/{test_posts[0].id}", json=data)
#     updated_post = schemas.Post(**res.json())
#     assert res.status_code == 200
#     assert updated_post.title == data['title']
#     assert updated_post.content == data['content']


# async def test_update_other_user_post(authorized_client, test_user, test_user2, test_posts):
#     data = {
#         "title": "updated title",
#         "content": "updatd content",
#         "id": test_posts[3].id

#     }
#     res = authorized_client.put(f"/posts/{test_posts[3].id}", json=data)
#     assert res.status_code == 403


# async def test_unauthorized_user_update_post(client, test_user, test_posts):
#     res = client.put(
#         f"/posts/{test_posts[0].id}")
#     assert res.status_code == 401


# async def test_update_post_non_exist(authorized_client, test_user, test_posts):
#     data = {
#         "title": "updated title",
#         "content": "updatd content",
#         "id": test_posts[3].id

#     }
#     res = authorized_client.put(
#         f"/posts/8000000", json=data)

#     assert res.status_code == 404
